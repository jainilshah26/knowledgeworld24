'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Contact() {
  const router = useRouter()
  const sectionRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const targets = [badgeRef.current, h2Ref.current, subRef.current, formRef.current, linksRef.current].filter(Boolean) as Element[]
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('vis') })
    }, { threshold: .2 })
    targets.forEach(t => obs.observe(t))
    return () => obs.disconnect()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameRef.current?.value ?? '',
          email: emailRef.current?.value ?? '',
          company: companyRef.current?.value ?? '',
          message: messageRef.current?.value ?? '',
        }),
      })
      if (!res.ok) throw new Error('Failed to send')
      router.push('/thank-you')
    } catch {
      setError('Something went wrong sending your message. Please try again.')
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="kw24-contact sec" ref={sectionRef}>
      <div className="glow"></div>
      <div className="wrap">
        <div className="badge" ref={badgeRef}><i></i> Let&apos;s Talk</div>
        <h2 ref={h2Ref}>Ready to <span className="g">Scale?</span></h2>
        <p className="subtext" ref={subRef}>Tell us about your business — we&apos;ll come back with a plan that actually moves the needle.</p>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="row">
            <input ref={nameRef} type="text" placeholder="Your Name" required />
            <input ref={emailRef} type="email" placeholder="Email Address" required />
          </div>
          <input ref={companyRef} type="text" placeholder="Company / Brand Name" />
          <textarea ref={messageRef} placeholder="Tell us about your goals..."></textarea>
          <button type="submit" className="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Message →'}
          </button>
          {error && <div className="form-error">{error}</div>}
        </form>

        <div className="links" ref={linksRef}>
          <a href="mailto:hello@knowledgeworld24.com">
            <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
            hello@knowledgeworld24.com
          </a>
          <a href="#">
            <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            GIFT City, Gandhinagar
          </a>
        </div>
      </div>

      <style jsx global>{`
        .kw24-contact.sec { position: relative; padding: 120px 56px; overflow: hidden; --card: #0a0f0c; --card-b: #17211c; }
        .kw24-contact.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#101512 1px, transparent 1px), linear-gradient(90deg, #101512 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000 30%, transparent 100%); z-index: 0; }
        .kw24-contact .glow { position: absolute; width: 700px; height: 400px; left: 50%; top: 50%; transform: translate(-50%,-50%); background: radial-gradient(ellipse, rgba(46,158,115,.06) 0%, transparent 70%); z-index: 0; pointer-events: none; }

        .kw24-contact .wrap { position: relative; z-index: 2; max-width: 520px; margin: 0 auto; text-align: center; }
        .kw24-contact .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #222; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(255,255,255,.45); letter-spacing: .5px; margin-bottom: 22px; opacity: 0; transform: translateY(16px); transition: all .6s var(--ease); }
        .kw24-contact .badge.vis { opacity: 1; transform: translateY(0); }
        .kw24-contact .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: contactBlink 1.4s infinite; }
        @keyframes contactBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-contact h2 { font-family: var(--display); font-size: clamp(30px,4vw,48px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.08; margin-bottom: 14px; opacity: 0; transform: translateY(20px); transition: all .7s var(--ease) .08s; }
        .kw24-contact h2.vis { opacity: 1; transform: translateY(0); }
        .kw24-contact h2 .g { color: var(--ivory); }
        .kw24-contact .subtext { font-size: 15px; font-weight: 300; color: rgba(255,255,255,.45); line-height: 1.7; margin-bottom: 44px; opacity: 0; transform: translateY(20px); transition: all .7s var(--ease) .16s; }
        .kw24-contact .subtext.vis { opacity: 1; transform: translateY(0); }

        .kw24-contact form { display: flex; flex-direction: column; gap: 12px; text-align: left; opacity: 0; transform: translateY(20px); transition: all .7s var(--ease) .24s; }
        .kw24-contact form.vis { opacity: 1; transform: translateY(0); }
        .kw24-contact .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .kw24-contact input, .kw24-contact textarea { width: 100%; background: var(--card); border: 1px solid var(--card-b); color: #fff; font-family: var(--body); font-size: 14px; font-weight: 300; padding: 14px 16px; border-radius: 6px; outline: none; transition: border-color .25s, box-shadow .25s; }
        .kw24-contact input::placeholder, .kw24-contact textarea::placeholder { color: rgba(255,255,255,.25); }
        .kw24-contact input:focus, .kw24-contact textarea:focus { border-color: rgba(46,158,115,.55); box-shadow: 0 0 0 3px rgba(46,158,115,.08); }
        .kw24-contact textarea { resize: none; height: 110px; line-height: 1.6; font-family: var(--body); }

        .kw24-contact .submit { margin-top: 6px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 16px; border: none; border-radius: 6px; cursor: pointer; transition: box-shadow .3s; }
        .kw24-contact .submit:hover { box-shadow: 0 0 40px rgba(46,158,115,.4); }
        .kw24-contact .submit:disabled { opacity: .7; cursor: default; }
        .kw24-contact .form-error { font-size: 13px; color: #ff6b6b; margin-top: 4px; }

        .kw24-contact .links { display: flex; justify-content: center; gap: 28px; margin-top: 36px; flex-wrap: wrap; opacity: 0; transform: translateY(16px); transition: all .7s var(--ease) .32s; }
        .kw24-contact .links.vis { opacity: 1; transform: translateY(0); }
        .kw24-contact .links a { display: flex; align-items: center; gap: 7px; font-size: 13px; color: rgba(255,255,255,.45); text-decoration: none; transition: color .2s; }
        .kw24-contact .links a:hover { color: var(--accent); }
        .kw24-contact .links svg { width: 15px; height: 15px; stroke: currentColor; fill: none; stroke-width: 1.6; stroke-linecap: round; }

        @media (max-width: 600px) {
          .kw24-contact.sec { padding: 80px 22px; }
          .kw24-contact .row { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
