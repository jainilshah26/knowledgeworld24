import { NextResponse } from 'next/server'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'

// PageSpeed Insights can take 20-40s for a full mobile audit; give the
// serverless function room beyond the framework default before it's killed.
export const maxDuration = 60

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
    const timeout = setTimeout(() => controller.abort(), 55000)
    const res = await fetch(psiUrl.toString(), { signal: controller.signal })
    clearTimeout(timeout)

    if (!res.ok) {
      const body = await res.text()
      console.error('PageSpeed API error:', res.status, body)
      return NextResponse.json(
        { ok: false, error: "We couldn't automatically analyze this URL right now." },
        { status: 502 }
      )
    }

    const data = await res.json()
    const categories = data?.lighthouseResult?.categories
    const audits = data?.lighthouseResult?.audits

    return NextResponse.json({
      ok: true,
      finalUrl: data?.lighthouseResult?.finalUrl || targetUrl,
      strategy: 'desktop',
      scores: {
        performance: scoreOf(categories, 'performance'),
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
    })
  } catch (err) {
    console.error('PageSpeed fetch failed:', err)
    return NextResponse.json(
      { ok: false, error: "We couldn't automatically analyze this URL right now." },
      { status: 502 }
    )
  }
}
