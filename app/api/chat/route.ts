import { NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'
import { answerFromKnowledge } from '@/lib/chatbotKnowledge'

const MAX_MESSAGE_LEN = 800

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (isRateLimited(`chat:${ip}`, { max: 40, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ ok: false, error: 'Too many messages. Please try again in a bit.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const text = (body as { text?: unknown })?.text
  if (typeof text !== 'string' || !text.trim() || text.length > MAX_MESSAGE_LEN) {
    return NextResponse.json({ ok: false, error: 'Invalid message.' }, { status: 400 })
  }

  const answer = answerFromKnowledge(text)
  return NextResponse.json({ ok: true, text: answer })
}
