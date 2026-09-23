import { NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'

// PageSpeed Insights regularly takes 30-90s on real-world sites. Fluid
// compute allows up to 300s on Hobby; 120s leaves headroom without letting
// a stuck request run indefinitely.
export const maxDuration = 120

const CATEGORIES = ['performance', 'seo', 'accessibility', 'best-practices']

function normalizeUrl(raw: string): string | null {
  let value = raw.trim()
  if (!value) return null
  if (!/^https?:\/\//i.test(value)) value = `https://${value}`
  try {
    const parsed = new URL(value)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    return parsed.toString()
  } catch {
    return null
  }
}

function scoreOf(categories: Record<string, { score: number | null }> | undefined, key: string) {
  const score = categories?.[key]?.score
  return typeof score === 'number' ? Math.round(score * 100) : null
}

function metricOf(audits: Record<string, { displayValue?: string; numericValue?: number }> | undefined, key: string) {
  const audit = audits?.[key]
  if (!audit) return null
  return { displayValue: audit.displayValue ?? null, numericValue: audit.numericValue ?? null }
}

async function runPageSpeed(targetUrl: string, apiKey: string) {
  const psiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  psiUrl.searchParams.set('url', targetUrl)
  psiUrl.searchParams.set('key', apiKey)
  // Desktop strategy skips Lighthouse's mobile CPU/network throttling,
  // which is what pushed audits of heavy, animation-driven pages (like
  // our own Three.js hero) past the serverless function's time limit.
  psiUrl.searchParams.set('strategy', 'desktop')
  CATEGORIES.forEach(cat => psiUrl.searchParams.append('category', cat))

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 110000)
    const res = await fetch(psiUrl.toString(), { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      const body = await res.text()
      console.error('PageSpeed API error:', res.status, body)
      return { ok: false, error: "We couldn't automatically analyze this URL right now." }
    }

    const data = await res.json()
    const categories = data?.lighthouseResult?.categories
    const audits = data?.lighthouseResult?.audits

    if (data?.lighthouseResult?.runtimeError?.code) {
      console.error('PageSpeed runtimeError:', data.lighthouseResult.runtimeError)
    }
    const lcpError = audits?.['largest-contentful-paint']?.errorMessage
    if (lcpError) {
      console.error('LCP audit error:', lcpError)
    }

    const performanceScore = scoreOf(categories, 'performance')
    const warnings: string[] = []
    if (performanceScore === null && lcpError === 'NO_LCP') {
      warnings.push(
        "We couldn't fully measure Performance — this usually happens on pages with heavy animation or canvas content that briefly confuses automated speed tools. SEO, Accessibility, and Best Practices are still accurate."
      )
    }

    return {
      ok: true,
      finalUrl: data?.lighthouseResult?.finalUrl || targetUrl,
      strategy: 'desktop',
      warnings,
      scores: {
        performance: performanceScore,
        seo: scoreOf(categories, 'seo'),
        accessibility: scoreOf(categories, 'accessibility'),
        bestPractices: scoreOf(categories, 'best-practices'),
      },
      metrics: {
        fcp: metricOf(audits, 'first-contentful-paint'),
        lcp: metricOf(audits, 'largest-contentful-paint'),
        cls: metricOf(audits, 'cumulative-layout-shift'),
        tbt: metricOf(audits, 'total-blocking-time'),
        speedIndex: metricOf(audits, 'speed-index'),
      },
    }
  } catch (err) {
    console.error('PageSpeed fetch failed:', err)
    return { ok: false, error: "We couldn't automatically analyze this URL right now." }
  }
}

export async function GET(request: Request) {
  const ip = getClientIp(request)
  if (isRateLimited(`pagespeed:${ip}`, { max: 12, windowMs: 10 * 60 * 1000 })) {
    return NextResponse.json({ ok: false, error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const rawUrl = searchParams.get('url') || ''
  const targetUrl = normalizeUrl(rawUrl)

  if (!targetUrl) {
    return NextResponse.json({ ok: false, error: 'Please provide a valid URL.' }, { status: 400 })
  }

  const apiKey = process.env.PAGESPEED_API_KEY
  if (!apiKey) {
    console.error('PAGESPEED_API_KEY is not set')
    return NextResponse.json({ ok: false, error: 'Audit tool is not configured yet.' }, { status: 500 })
  }

  // The PSI request itself can take 30-90s. A single request/response that
  // stays completely silent for that long looks idle to mobile carrier
  // proxies and in-app browsers, which then drop the connection before we
  // ever get to respond — the client sees a generic failure. Streaming
  // newline-delimited JSON with periodic pings keeps the connection alive
  // end-to-end so the real result reaches the client.
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'ping' })}\n`))
      }, 10000)

      const result = await runPageSpeed(targetUrl, apiKey)

      clearInterval(ping)
      controller.enqueue(encoder.encode(`${JSON.stringify({ type: 'result', ...result })}\n`))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
