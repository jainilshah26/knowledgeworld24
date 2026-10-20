'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

interface PageSpeedResult {
  ok: boolean
  error?: string
  finalUrl?: string
  warnings?: string[]
  scores?: {
    performance: number | null
    seo: number | null
    accessibility: number | null
    bestPractices: number | null
  }
}

const STEPS = [
  'Crawling your site…',
  'Checking page speed…',
  'Scanning SEO signals…',
  'Reviewing accessibility…',
  'Checking best practices…',
]

const SCORES: { key: keyof NonNullable<PageSpeedResult['scores']>; label: string }[] = [
  { key: 'performance', label: 'Performance' },
  { key: 'seo', label: 'SEO' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'bestPractices', label: 'Best Practices' },
]

function scoreClass(score: number | null) {
  if (score === null) return 'na'
  if (score >= 90) return 'good'
  if (score >= 50) return 'ok'
  return 'poor'
}

type Status = 'idle' | 'running' | 'done' | 'failed'

export default function TryAgent() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [stepIdx, setStepIdx] = useState(0)
  const [result, setResult] = useState<PageSpeedResult | null>(null)
  const [error, setError] = useState('')
  const running = useRef(false)

  async function runAgent(e: React.FormEvent) {
    e.preventDefault()
    const target = url.trim()
    if (!target || running.current) return

    running.current = true
    setStatus('running')
    setStepIdx(0)
    setResult(null)
    setError('')

    try {
      const res = await fetch(`/api/pagespeed?url=${encodeURIComponent(target)}`)

      // Early-exit errors (missing config, bad URL, rate limit) come back as
      // a single plain JSON body, not the newline-delimited stream the
      // success/failure path below uses — handle that shape separately,
      // and before acquiring a stream reader, so it doesn't get stuck
      // waiting for a line that never arrives.
      if (!res.ok) {
        const text = await res.text()
        try {
          const data = JSON.parse(text)
          setError(data.error || "Couldn't audit that URL — try a different one.")
        } catch {
          setError("Couldn't audit that URL — try a different one.")
        }
        setStatus('failed')
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        let newlineIdx = buffer.indexOf('\n')
        while (newlineIdx !== -1) {
          const line = buffer.slice(0, newlineIdx).trim()
          buffer = buffer.slice(newlineIdx + 1)
          newlineIdx = buffer.indexOf('\n')
          if (!line) continue

          const msg = JSON.parse(line)
          if (msg.type === 'ping') {
            setStepIdx(i => Math.min(i + 1, STEPS.length - 1))
          } else if (msg.type === 'result') {
            const data: PageSpeedResult = msg
            if (data.ok) {
              setStepIdx(STEPS.length - 1)
              setResult(data)
              setStatus('done')
            } else {
              setError(data.error || "Couldn't audit that URL — try a different one.")
              setStatus('failed')
            }
          }
        }
      }
    } catch {
      setError("Couldn't reach the agent right now — please try again.")
      setStatus('failed')
    } finally {
      running.current = false
    }
  }

  return (
    <section id="try-agent" className="kw24-try-agent sec">
      <div className="wrap">
        <div className="head">
          <div className="badge"><i></i> Try It Live</div>
          <h2>Watch Our <span className="g">SEO Agent</span> Audit Your Site.</h2>
          <p className="sub">Drop in your URL — the same agent we run for clients will crawl it and score it live, right here.</p>
        </div>

        <form className="runner" onSubmit={runAgent}>
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="yourwebsite.com"
            disabled={status === 'running'}
            required
          />
          <button type="submit" className="bp" disabled={status === 'running' || !url.trim()}>
            {status === 'running' ? 'Running…' : 'Run Agent →'}
          </button>
        </form>

        {status === 'running' && (
          <div className="steps">
            {STEPS.map((step, i) => (
              <div key={step} className={`step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}`}>
                <span className="dot" />
                {step}
              </div>
            ))}
          </div>
        )}

        {status === 'failed' && (
          <div className="fail">
            <p>{error}</p>
          </div>
        )}

        {status === 'done' && result?.scores && (
          <div className="results">
            <p className="resultUrl">Results for {result.finalUrl}</p>
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
            {result.warnings && result.warnings.length > 0 && (
              <div className="warnings">{result.warnings.map((w, i) => <p key={i}>{w}</p>)}</div>
            )}
            <div className="cta">
              <p>This is the quick version — our full audit digs into exactly what&apos;s costing you rankings.</p>
              <Link href="/free-audit" className="bp">Get The Full Audit →</Link>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .kw24-try-agent.sec { position: relative; padding: 90px 56px; overflow: hidden; }
        .kw24-try-agent.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); z-index: 0; }

        .kw24-try-agent .wrap { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
        .kw24-try-agent .head { text-align: center; margin-bottom: 36px; }
        .kw24-try-agent .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid var(--card-b); padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(26,23,18,.45); letter-spacing: .5px; margin-bottom: 22px; }
        .kw24-try-agent .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: tryAgentBlink 1.4s infinite; }
        @keyframes tryAgentBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-try-agent h2 { font-family: var(--display); font-size: clamp(28px,4vw,42px); font-weight: 800; letter-spacing: -1.2px; line-height: 1.15; margin-bottom: 12px; }
        .kw24-try-agent h2 .g { color: var(--accent); }
        .kw24-try-agent .sub { font-size: 15px; color: rgba(26,23,18,.5); line-height: 1.6; }

        .kw24-try-agent .runner { display: flex; gap: 10px; }
        .kw24-try-agent .runner input { flex: 1; background: var(--card); border: 1px solid var(--card-b); color: var(--ink); font-size: 14.5px; padding: 15px 18px; border-radius: 6px; outline: none; transition: border-color .25s; }
        .kw24-try-agent .runner input:focus { border-color: rgba(184,145,43,.5); }
        .kw24-try-agent .runner input:disabled { opacity: .6; }
        .kw24-try-agent .bp { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: .6px; text-transform: uppercase; padding: 0 26px; border: none; border-radius: 6px; text-decoration: none; cursor: pointer; transition: opacity .2s; white-space: nowrap; }
        .kw24-try-agent .bp:hover:not(:disabled) { opacity: .85; }
        .kw24-try-agent .bp:disabled { opacity: .5; cursor: not-allowed; }

        .kw24-try-agent .steps { margin-top: 26px; background: var(--card); border: 1px solid var(--card-b); border-radius: 12px; padding: 20px 22px; display: flex; flex-direction: column; gap: 12px; }
        .kw24-try-agent .step { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: rgba(26,23,18,.35); transition: color .3s; }
        .kw24-try-agent .step .dot { width: 7px; height: 7px; border-radius: 50%; background: #d8d0bc; flex-shrink: 0; transition: background .3s; }
        .kw24-try-agent .step.active { color: var(--ink); font-weight: 600; }
        .kw24-try-agent .step.active .dot { background: var(--accent); animation: tryAgentBlink 1s infinite; }
        .kw24-try-agent .step.done { color: rgba(26,23,18,.55); }
        .kw24-try-agent .step.done .dot { background: #2e9e5b; }

        .kw24-try-agent .fail { margin-top: 24px; background: #fbf3e6; border: 1px solid #ecd9ae; border-radius: 12px; padding: 16px 20px; text-align: center; }
        .kw24-try-agent .fail p { font-size: 13.5px; color: rgba(26,23,18,.65); }

        .kw24-try-agent .results { margin-top: 30px; }
        .kw24-try-agent .resultUrl { text-align: center; font-size: 12.5px; color: rgba(26,23,18,.45); margin-bottom: 18px; word-break: break-word; }
        .kw24-try-agent .scores { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; }
        .kw24-try-agent .score-card { background: var(--card); border: 1px solid var(--card-b); border-radius: 14px; padding: 20px 10px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .kw24-try-agent .ring { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: conic-gradient(var(--ring-color, var(--accent)) var(--pct, 0%), #ede6d5 0); position: relative; }
        .kw24-try-agent .ring::before { content: ''; position: absolute; inset: 6px; border-radius: 50%; background: #fff; }
        .kw24-try-agent .ring span { position: relative; z-index: 1; font-family: var(--display); font-weight: 800; font-size: 17px; color: var(--ink); }
        .kw24-try-agent .score-card.good .ring { --ring-color: #2e9e5b; }
        .kw24-try-agent .score-card.ok .ring { --ring-color: #b8912b; }
        .kw24-try-agent .score-card.poor .ring { --ring-color: #d94f4f; }
        .kw24-try-agent .score-card.na .ring { --ring-color: #ccc; }
        .kw24-try-agent .score-card .label { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: .3px; color: rgba(26,23,18,.5); text-align: center; }

        .kw24-try-agent .warnings { background: #fbf3e6; border: 1px solid #ecd9ae; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; }
        .kw24-try-agent .warnings p { font-size: 12.5px; color: rgba(26,23,18,.65); line-height: 1.6; }

        .kw24-try-agent .cta { text-align: center; padding-top: 6px; }
        .kw24-try-agent .cta p { font-size: 14px; color: rgba(26,23,18,.55); margin-bottom: 18px; }

        @media (max-width: 600px) {
          .kw24-try-agent.sec { padding: 60px 22px; }
          .kw24-try-agent .runner { flex-direction: column; }
          .kw24-try-agent .scores { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  )
}
