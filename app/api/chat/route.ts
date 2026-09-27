import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'

export const maxDuration = 60

const MAX_MESSAGE_LEN = 800
const MAX_HISTORY = 20

const SYSTEM_INSTRUCTION = `You are the on-site assistant for Knowledge World24, an AI-first digital marketing agency in Ahmedabad, India. You help website visitors with quick questions about the agency.

What Knowledge World24 does: SEO & AI search optimization, AI automation/agents, performance marketing (Meta & Google Ads), social media, content marketing, and video production. The pitch is "agentic SEO that actually ranks" — AI agents that reverse-engineer the SERP, close content gaps, and climb rankings, then keep them there.

Rules:
- Keep replies short — 2-4 sentences, no walls of text, plain language, no markdown headers.
- If someone wants pricing, a proposal, or to talk to a human, tell them to use the "Get Free Audit" button (a free website/SEO audit) or the contact form at the bottom of the page — you cannot quote prices or make commitments yourself.
- If you don't know something specific about the business, say so plainly instead of guessing.
- Stay on topic: this agency's services, marketing/SEO questions, and how to get in touch. Politely redirect anything unrelated back to how you can help with their marketing.
- Never claim to be human. You're a helpful assistant, not a salesperson pretending otherwise.`

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_HISTORY) return false
  return value.every(
    m =>
      m &&
      typeof m === 'object' &&
      (m.role === 'user' || m.role === 'assistant') &&
      typeof m.text === 'string' &&
      m.text.trim().length > 0 &&
      m.text.length <= MAX_MESSAGE_LEN
  )
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (isRateLimited(`chat:${ip}`, { max: 20, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ ok: false, error: 'Too many messages. Please try again in a bit.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const messages = (body as { messages?: unknown })?.messages
  if (!isValidHistory(messages)) {
    return NextResponse.json({ ok: false, error: 'Invalid message.' }, { status: 400 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not set')
    return NextResponse.json({ ok: false, error: 'Chat is not configured yet.' }, { status: 500 })
  }

  const ai = new GoogleGenAI({ apiKey })
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.text }],
  }))

  try {
    // Gemini occasionally returns a transient 503 "model overloaded" error.
    // Retry a couple of times with a short backoff before giving up — this
    // happens before any streaming starts, so it's safe to retry whole.
    let geminiStream
    const retryDelaysMs = [500, 1500]
    for (let attempt = 0; ; attempt++) {
      try {
        geminiStream = await ai.models.generateContentStream({
          model: 'gemini-flash-latest',
          contents,
          config: { systemInstruction: SYSTEM_INSTRUCTION },
        })
        break
      } catch (err) {
        const status = (err as { status?: number })?.status
        if (status !== 503 || attempt >= retryDelaysMs.length) throw err
        await new Promise(resolve => setTimeout(resolve, retryDelaysMs[attempt]))
      }
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of geminiStream) {
            if (chunk.text) controller.enqueue(encoder.encode(chunk.text))
          }
        } catch (err) {
          console.error('Gemini stream failed:', err)
          if (!controller.desiredSize) return
          controller.enqueue(encoder.encode("\n\nSorry, something went wrong on my end — please try again."))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err) {
    console.error('Gemini request failed:', err)
    return NextResponse.json(
      { ok: false, error: "Sorry, I couldn't respond right now. Please try again shortly." },
      { status: 502 }
    )
  }
}
