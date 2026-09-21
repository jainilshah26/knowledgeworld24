'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function FreeAuditForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const businessNameRef = useRef<HTMLInputElement>(null)
  const businessUrlRef = useRef<HTMLInputElement>(null)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)
  const honeypotRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/free-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameRef.current?.value ?? '',
          email: emailRef.current?.value ?? '',
          businessName: businessNameRef.current?.value ?? '',
          businessUrl: businessUrlRef.current?.value ?? '',
          description: descriptionRef.current?.value ?? '',
          website: honeypotRef.current?.value ?? '',
        }),
      })
      if (!res.ok) throw new Error('Failed to send')

      const params = new URLSearchParams({
        url: businessUrlRef.current?.value ?? '',
        business: businessNameRef.current?.value ?? '',
        name: (nameRef.current?.value ?? '').split(' ')[0],
      })
      router.push(`/free-audit/report?${params.toString()}`)
    } catch {
      setError('Something went wrong sending your request. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section className="kw24-audit sec">
      <div className="glow"></div>
      <div className="wrap">
        <Link href="/" className="back">← Back to Home</Link>
        <div className="badge"><i></i> Free Audit</div>
        <h1>Get Your Free <span className="g">Growth Audit.</span></h1>
        <p className="subtext">Tell us about your business and we&apos;ll send back a free audit covering SEO, ads, and automation opportunities.</p>

        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            ref={honeypotRef}
            type="text"
            name="website"
            className="hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div className="row">
            <input ref={nameRef} type="text" placeholder="Your Name" required />
            <input ref={emailRef} type="email" placeholder="Email Address" required />
          </div>
          <div className="row">
            <input ref={businessNameRef} type="text" placeholder="Business Name" required />
            <input ref={businessUrlRef} type="text" placeholder="Business URL" required />
          </div>
          <textarea ref={descriptionRef} placeholder="Tell us about your business (optional)..."></textarea>
          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Get My Free Audit →'}
          </button>
          {error && <div className="form-error">{error}</div>}
        </form>
      </div>

      <style jsx global>{`
        .kw24-audit.sec { position: relative; min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center; padding: 80px 56px; overflow: hidden; --card: #ffffff; --card-b: #e4dcc8; }
        .kw24-audit.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%); z-index: 0; }
        .kw24-audit .glow { position: absolute; width: 700px; height: 400px; left: 50%; top: 50%; transform: translate(-50%,-50%); background: radial-gradient(ellipse, rgba(184,145,43,.06) 0%, transparent 70%); z-index: 0; pointer-events: none; }

        .kw24-audit .wrap { position: relative; z-index: 2; max-width: 560px; width: 100%; margin: 0 auto; text-align: center; }
        .kw24-audit .back { display: block; font-size: 13px; color: rgba(26,23,18,.45); text-decoration: none; margin-bottom: 20px; transition: color .2s; }
        .kw24-audit .back:hover { color: var(--accent); }
        .kw24-audit .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e4dcc8; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(26,23,18,.45); letter-spacing: .5px; margin-bottom: 22px; }
        .kw24-audit .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: auditBlink 1.4s infinite; }
        @keyframes auditBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-audit h1 { font-family: var(--display); font-size: clamp(30px,4vw,48px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.08; margin-bottom: 14px; }
        .kw24-audit h1 .g { color: var(--accent); }
        .kw24-audit .subtext { font-size: 15px; font-weight: 300; color: rgba(26,23,18,.45); line-height: 1.7; margin-bottom: 40px; max-width: 460px; margin-left: auto; margin-right: auto; }

        .kw24-audit form { display: flex; flex-direction: column; gap: 12px; text-align: left; }
        .kw24-audit .hp { position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
        .kw24-audit .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .kw24-audit input, .kw24-audit textarea { width: 100%; background: var(--card); border: 1px solid var(--card-b); color: #1a1712; font-family: var(--body); font-size: 14px; font-weight: 300; padding: 14px 16px; border-radius: 6px; outline: none; transition: border-color .25s, box-shadow .25s; }
        .kw24-audit input::placeholder, .kw24-audit textarea::placeholder { color: rgba(26,23,18,.25); }
        .kw24-audit input:focus, .kw24-audit textarea:focus { border-color: rgba(184,145,43,.55); box-shadow: 0 0 0 3px rgba(184,145,43,.08); }
        .kw24-audit textarea { resize: none; height: 110px; line-height: 1.6; font-family: var(--body); }

        .kw24-audit .submit { margin-top: 6px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 16px; border: none; border-radius: 6px; cursor: pointer; transition: box-shadow .3s; }
        .kw24-audit .submit:hover { box-shadow: 0 0 40px rgba(184,145,43,.4); }
        .kw24-audit .submit:disabled { opacity: .7; cursor: default; }
        .kw24-audit .form-error { font-size: 13px; color: #ff6b6b; margin-top: 4px; }

        @media (max-width: 600px) {
          .kw24-audit.sec { padding: 70px 22px; }
          .kw24-audit .row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
