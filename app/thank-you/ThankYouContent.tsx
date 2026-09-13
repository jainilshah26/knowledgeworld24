'use client'

export default function ThankYouContent() {
  return (
    <section className="kw24-thank-you sec">
      <div className="glow"></div>
      <div className="card">
        <div className="check">
          <svg viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg>
        </div>
        <div className="badge">Message Received</div>
        <h1>Thanks for Reaching Out to <span className="g">Knowledge World24.</span></h1>
        <p className="sub">Our team will review your message and get back to you within 24 hours. In the meantime, feel free to explore our work.</p>
        <div className="actions">
          <a href="/" className="bp">Back to Home</a>
          <a href="/#services" className="bs">Explore Our Services</a>
        </div>
      </div>

      <style jsx global>{`
        .kw24-thank-you.sec { min-height: 100vh; min-height: 100svh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; padding: 24px; }
        .kw24-thank-you.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 55% 60% at 50% 50%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 55% 60% at 50% 50%, #000 30%, transparent 100%); }
        .kw24-thank-you .glow { position: absolute; width: 600px; height: 400px; left: 50%; top: 50%; transform: translate(-50%,-50%); background: radial-gradient(ellipse, rgba(184,145,43,.09) 0%, transparent 70%); pointer-events: none; }

        .kw24-thank-you .card { position: relative; z-index: 2; text-align: center; max-width: 480px; }

        .kw24-thank-you .check { width: 76px; height: 76px; border-radius: 50%; border: 1.5px solid var(--accent); display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; opacity: 0; transform: scale(.6); animation: tyPop .6s var(--ease) .1s forwards; }
        .kw24-thank-you .check svg { width: 32px; height: 32px; stroke: var(--accent); fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 40; stroke-dashoffset: 40; animation: tyDraw .5s ease .5s forwards; }
        @keyframes tyPop { to { opacity: 1; transform: scale(1); } }
        @keyframes tyDraw { to { stroke-dashoffset: 0; } }

        .kw24-thank-you .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e4dcc8; padding: 6px 14px; border-radius: 100px; font-family: var(--mono); font-size: 11px; color: rgba(26,23,18,.45); letter-spacing: .5px; margin-bottom: 20px; opacity: 0; animation: tyFade .7s ease .7s forwards; }
        @keyframes tyFade { to { opacity: 1; } }

        .kw24-thank-you h1 { font-family: var(--display); font-size: clamp(30px,4.5vw,46px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px; opacity: 0; transform: translateY(16px); animation: tyUp .7s var(--ease) .8s forwards; }
        .kw24-thank-you h1 .g { color: var(--accent); }
        @keyframes tyUp { to { opacity: 1; transform: translateY(0); } }

        .kw24-thank-you .sub { font-size: 15px; font-weight: 300; color: rgba(26,23,18,.45); line-height: 1.7; max-width: 400px; margin: 0 auto 40px; opacity: 0; transform: translateY(16px); animation: tyUp .7s var(--ease) .9s forwards; }

        .kw24-thank-you .actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; opacity: 0; transform: translateY(16px); animation: tyUp .7s var(--ease) 1s forwards; }
        .kw24-thank-you .bp { display: inline-flex; align-items: center; gap: 9px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 15px 28px; border-radius: 6px; text-decoration: none; transition: box-shadow .3s; }
        .kw24-thank-you .bp:hover { box-shadow: 0 0 40px rgba(184,145,43,.4); }
        .kw24-thank-you .bs { display: inline-flex; align-items: center; color: rgba(26,23,18,.45); font-size: 13px; padding: 15px 22px; border: 1px solid #e4dcc8; border-radius: 6px; text-decoration: none; transition: all .3s; }
        .kw24-thank-you .bs:hover { color: #1a1712; border-color: #b8912b; }
      `}</style>
    </section>
  )
}
