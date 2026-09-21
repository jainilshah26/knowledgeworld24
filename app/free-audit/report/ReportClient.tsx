'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PageSpeedResult {
  ok: boolean
  error?: string
  finalUrl?: string
  scores?: {
    performance: number | null
    seo: number | null
    accessibility: number | null
    bestPractices: number | null
  }
  metrics?: {
    fcp: { displayValue: string | null } | null
    lcp: { displayValue: string | null } | null
    cls: { displayValue: string | null } | null
    tbt: { displayValue: string | null } | null
    speedIndex: { displayValue: string | null } | null
  }
}

const STATUS_MESSAGES = [
  'Fetching your website…',
  'Checking page speed…',
  'Analyzing SEO signals…',
  'Reviewing accessibility…',
  'Checking best practices…',
  'Putting your report together…',
]

const SCORES: { key: keyof NonNullable<PageSpeedResult['scores']>; label: string }[] = [
  { key: 'performance', label: 'Performance' },
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'bestPractices', label: 'Best Practices' },
]

const METRICS: { key: keyof NonNullable<PageSpeedResult['metrics']>; label: string; hint: string }[] = [
  { key: 'lcp', label: 'Largest Contentful Paint', hint: 'How fast the main content loads' },
  { key: 'fcp', label: 'First Contentful Paint', hint: 'How fast the first pixel appears' },
  { key: 'cls', label: 'Cumulative Layout Shift', hint: 'How much the page jumps around while loading' },
  { key: 'tbt', label: 'Total Blocking Time', hint: 'How long the page is unresponsive to input' },
  { key: 'speedIndex', label: 'Speed Index', hint: 'How quickly content is visually displayed' },
]

function scoreClass(score: number | null) {
  if (score === null) return 'na'
  if (score >= 90) return 'good'
  if (score >= 50) return 'ok'
  return 'poor'
}

export default function ReportClient() {
  const params = useSearchParams()
  const url = params.get('url') || ''
  const business = params.get('business') || 'your website'
  const name = params.get('name') || 'there'

  const [status, setStatus] = useState<'loading' | 'done' | 'failed'>('loading')
  const [result, setResult] = useState<PageSpeedResult | null>(null)
  const [statusIdx, setStatusIdx] = useState(0)
  const fetched = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIdx(i => (i + 1) % STATUS_MESSAGES.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true

    fetch(`/api/pagespeed?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then((data: PageSpeedResult) => {
        setResult(data)
        setStatus(data.ok ? 'done' : 'failed')
      })
      .catch(() => setStatus('failed'))
  }, [url])

  return (
    <section className="kw24-report sec">
      <div className="wrap">
        {status === 'loading' && (
          <div className="loading">
            <div className="spinner"></div>
            <div className="badge"><i></i> Audit In Progress</div>
            <h1>Thanks, {name}! Our team is <span className="g">auditing {business}.</span></h1>
            <p className="status">{STATUS_MESSAGES[statusIdx]}</p>
          </div>
        )}

        {status === 'failed' && (
          <div className="loading">
            <div className="badge fail"><i></i> Manual Review Needed</div>
            <h1>We&apos;ll audit <span className="g">{business}</span> by hand.</h1>
            <p className="status">
              {result?.error || "We couldn't automatically scan this URL — it might be blocking automated tools, or offline."}
              {' '}No worries — our team will review it manually and follow up within 24 hours.
            </p>
            <Link href="/" className="bp">Back to Home</Link>
          </div>
        )}

        {status === 'done' && result?.scores && (
          <>
            <div className="head">
              <div className="badge"><i></i> Audit Complete</div>
              <h1>Here&apos;s how <span className="g">{business}</span> scores.</h1>
              <p className="sub">Automated results for {result.finalUrl || url} · mobile · powered by Google PageSpeed Insights</p>
            </div>

            <div className="scores">
              {SCORES.map(s => (
                <div key={s.key} className={`score-card ${scoreClass(result.scores![s.key])}`}>
                  <div className="ring" style={{ ['--pct' as string]: `${result.scores![s.key] ?? 0}%` }}>
                    <span>{result.scores![s.key] ?? '–'}</span>
                  </div>
                  <div className="label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="metrics">
              <div className="metrics-title">Core Web Vitals &amp; Speed Metrics</div>
              <div className="metrics-grid">
                {METRICS.map(m => (
                  <div key={m.key} className="metric">
                    <div className="mval">{result.metrics?.[m.key]?.displayValue || '—'}</div>
                    <div className="mlabel">{m.label}</div>
                    <div className="mhint">{m.hint}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="cta">
              <p>These numbers are just the surface — our team can tell you exactly what&apos;s costing you rankings and revenue.</p>
              <Link href="/#contact" className="bp">Talk To Our Team →</Link>
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .kw24-report.sec { position: relative; min-height: 100vh; min-height: 100svh; padding: 140px 56px 100px; overflow: hidden; }
        .kw24-report.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); z-index: 0; }

        .kw24-report .wrap { position: relative; z-index: 2; max-width: 920px; margin: 0 auto; }

        .kw24-report .loading { text-align: center; max-width: 560px; margin: 60px auto 0; }
        .kw24-report .spinner { width: 44px; height: 44px; border: 3px solid #e4dcc8; border-top-color: var(--accent); border-radius: 50%; margin: 0 auto 28px; animation: reportSpin 1s linear infinite; }
        @keyframes reportSpin { to { transform: rotate(360deg); } }
        .kw24-report .status { font-size: 14.5px; color: rgba(26,23,18,.5); margin-top: 12px; }

        .kw24-report .head { text-align: center; max-width: 640px; margin: 0 auto 48px; }
        .kw24-report .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e4dcc8; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(26,23,18,.45); letter-spacing: .5px; margin-bottom: 22px; }
        .kw24-report .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: reportBlink 1.4s infinite; }
        .kw24-report .badge.fail i { background: #d97757; }
        @keyframes reportBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-report h1 { font-family: var(--display); font-size: clamp(26px,4vw,42px); font-weight: 800; letter-spacing: -1.2px; line-height: 1.15; margin-bottom: 12px; }
        .kw24-report h1 .g { color: var(--accent); }
        .kw24-report .sub { font-size: 14px; color: rgba(26,23,18,.45); word-break: break-word; }

        .kw24-report .scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 48px; }
        .kw24-report .score-card { background: #fff; border: 1px solid #e4dcc8; border-radius: 16px; padding: 28px 16px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .kw24-report .ring { width: 84px; height: 84px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: conic-gradient(var(--ring-color, var(--accent)) var(--pct, 0%), #ede6d5 0); position: relative; }
        .kw24-report .ring::before { content: ''; position: absolute; inset: 7px; border-radius: 50%; background: #fff; }
        .kw24-report .ring span { position: relative; z-index: 1; font-family: var(--display); font-weight: 800; font-size: 22px; color: #1a1712; }
        .kw24-report .score-card.good .ring { --ring-color: #2e9e5b; }
        .kw24-report .score-card.ok .ring { --ring-color: #b8912b; }
        .kw24-report .score-card.poor .ring { --ring-color: #d94f4f; }
        .kw24-report .score-card.na .ring { --ring-color: #ccc; }
        .kw24-report .score-card .label { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .4px; color: rgba(26,23,18,.5); text-align: center; }

        .kw24-report .metrics { background: #fff; border: 1px solid #e4dcc8; border-radius: 16px; padding: 32px; margin-bottom: 40px; }
        .kw24-report .metrics-title { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .5px; color: rgba(26,23,18,.45); margin-bottom: 20px; }
        .kw24-report .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .kw24-report .metric .mval { font-family: var(--display); font-size: 22px; font-weight: 800; color: #1a1712; margin-bottom: 4px; }
        .kw24-report .metric .mlabel { font-size: 13px; font-weight: 600; color: #1a1712; margin-bottom: 4px; }
        .kw24-report .metric .mhint { font-size: 12px; color: rgba(26,23,18,.45); line-height: 1.5; }

        .kw24-report .cta { text-align: center; padding-top: 8px; }
        .kw24-report .cta p { font-size: 15px; color: rgba(26,23,18,.55); margin-bottom: 22px; max-width: 480px; margin-left: auto; margin-right: auto; }
        .kw24-report .bp, .kw24-report .loading .bp { display: inline-flex; align-items: center; gap: 9px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 15px 28px; border-radius: 6px; text-decoration: none; transition: box-shadow .3s; margin-top: 12px; }
        .kw24-report .bp:hover { box-shadow: 0 0 40px rgba(184,145,43,.4); }

        @media (max-width: 900px) {
          .kw24-report .scores { grid-template-columns: repeat(2, 1fr); }
          .kw24-report .metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .kw24-report.sec { padding: 110px 22px 70px; }
          .kw24-report .metrics { padding: 24px; }
          .kw24-report .metrics-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
