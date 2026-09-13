'use client'

import { useEffect, useRef } from 'react'

interface AdDatum {
  brand: string
  av: string
  avt: string
  grad: string
  icon: string
  prod: string
  cta: string
  roas: string
  ctr: string
}

const ADS: AdDatum[] = [
  {
    brand: 'GlowSkin', av: '#e1306c', avt: 'G',
    grad: 'linear-gradient(135deg,#2c0f1c 0%,#7a2a45 55%,#d68aa4 100%)',
    icon: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5c3.3 4.3 6.5 8.2 6.5 12A6.5 6.5 0 1 1 5.5 14.5c0-3.8 3.2-7.7 6.5-12z"/></svg>',
    prod: 'Vitamin C Serum — 40% Off Today', cta: 'Shop Now', roas: '6.2×', ctr: '4.8%',
  },
  {
    brand: 'FitGear', av: '#1c1e21', avt: 'F',
    grad: 'linear-gradient(135deg,#0a1f19 0%,#1c4536 55%,#5fa889 100%)',
    icon: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7v10M18 7v10M2 10v4M22 10v4M6 12h12"/></svg>',
    prod: 'Smart Resistance Bands Set', cta: 'Buy Now', roas: '5.1×', ctr: '3.9%',
  },
  {
    brand: 'BrewCo', av: '#8a6d10', avt: 'B',
    grad: 'linear-gradient(135deg,#2a1608 0%,#6b3d1c 55%,#2e9e73 100%)',
    icon: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h13a3 3 0 0 1 0 6h-1M4 8v6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V8M4 8V5h13v3"/></svg>',
    prod: 'Cold Brew Maker — Free Shipping', cta: 'Order', roas: '7.4×', ctr: '5.6%',
  },
]

const W = 460, H = 120
const CUR = [58, 52, 49, 53, 44, 40, 42, 35, 30, 28, 22, 18, 14, 9]
const PREV = [70, 72, 69, 71, 73, 70, 74, 72, 75, 73, 76, 74, 77, 75]

function pts(arr: number[]) {
  return arr.map((y, i) => (i * (W / (arr.length - 1))) + ',' + y).join(' ')
}

export default function MetaAds() {
  const roasRef = useRef<HTMLSpanElement>(null)
  const spendRef = useRef<HTMLDivElement>(null)
  const convRef = useRef<HTMLDivElement>(null)
  const convDRef = useRef<HTMLDivElement>(null)
  const revRef = useRef<HTMLDivElement>(null)
  const cpaRef = useRef<HTMLDivElement>(null)
  const cpaDRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<SVGPolylineElement>(null)
  const line2Ref = useRef<SVGPolylineElement>(null)
  const areaRef = useRef<SVGPolygonElement>(null)
  const adrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const intervals: ReturnType<typeof setInterval>[] = []
    const runTimeout = (fn: () => void, ms: number) => { timeouts.push(setTimeout(fn, ms)) }
    const runInterval = (fn: () => void, ms: number) => { const t = setInterval(fn, ms); intervals.push(t); return t }

    /* ---- count-up KPIs ---- */
    function animateVal(el: HTMLElement | null, target: number, fmt: (n: number) => string, dur = 1800, delay = 0) {
      runTimeout(() => {
        if (!el) return
        let cur = 0
        const steps = 70
        const inc = target / steps
        const t = runInterval(() => {
          cur = Math.min(cur + inc, target)
          el.textContent = fmt(cur)
          if (cur >= target) clearInterval(t)
        }, dur / steps)
      }, delay)
    }
    const inr = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

    animateVal(spendRef.current, 184000, inr, 1800, 400)
    animateVal(convRef.current, 1247, n => Math.round(n).toLocaleString('en-IN'), 1800, 500)
    animateVal(revRef.current, 1067000, inr, 2000, 600)
    animateVal(cpaRef.current, 148, inr, 1600, 500)

    runTimeout(() => {
      const el = roasRef.current
      let r = 0
      const t = runInterval(() => {
        r = Math.min(r + 5.8 / 80, 5.8)
        if (el) el.textContent = r.toFixed(1) + '×'
        if (r >= 5.8) clearInterval(t)
      }, 22)
    }, 700)
    runTimeout(() => { if (convDRef.current) convDRef.current.textContent = '↑ 312%' }, 2300)
    runTimeout(() => { if (cpaDRef.current) cpaDRef.current.textContent = '↓ 41% cheaper' }, 2100)

    /* ---- chart paths ---- */
    line1Ref.current?.setAttribute('points', pts(CUR))
    line2Ref.current?.setAttribute('points', pts(PREV))
    areaRef.current?.setAttribute('points', '0,' + H + ' ' + pts(CUR) + ' ' + W + ',' + H)

    /* ---- product ad creatives ---- */
    const adrow = adrowRef.current
    const createdCards: HTMLDivElement[] = []
    if (adrow) {
      ADS.forEach((a, i) => {
        const c = document.createElement('div')
        c.className = 'adcard'
        c.innerHTML = `
    <div class="ad-top">
      <div class="ad-av" style="background:${a.av}">${a.avt}</div>
      <div><div class="ad-brand">${a.brand}</div><div class="ad-spon">Sponsored · @${a.brand.toLowerCase()}</div></div>
    </div>
    <div class="ad-img" style="background:${a.grad}"><span class="ad-icon">${a.icon}</span><div class="prod">${a.prod}</div></div>
    <div class="ad-cta"><span class="txt">${a.brand.toLowerCase()}.com</span><span class="btn">${a.cta}</span></div>
    <div class="ad-stats"><span>ROAS <b>${a.roas}</b></span><span>CTR <b>${a.ctr}</b></span></div>`
        adrow.appendChild(c)
        createdCards.push(c)
        runTimeout(() => {
          c.style.transition = 'opacity .5s ease, transform .5s ease'
          c.style.opacity = '1'
          c.style.transform = 'translateY(0)'
        }, 900 + i * 180)
      })
    }

    return () => {
      timeouts.forEach(clearTimeout)
      intervals.forEach(clearInterval)
      if (adrow) adrow.innerHTML = ''
    }
  }, [])

  return (
    <section id="performance-marketing" className="kw24-meta-ads sec">
      <div className="meta-inner">
      <div className="left">
        <div className="badge"><i></i> Performance Marketing</div>
        <h2>We Turn Ad Spend Into <span className="g">Predictable Revenue.</span></h2>
        <p className="sub">Our AI watches every campaign in real time — pausing losers, scaling winners, and rewriting creative until the numbers climb. You just watch the ROAS go up.</p>
        <ul className="points">
          <li><span className="tick">✓</span> Live bid &amp; budget optimisation across Meta &amp; Google</li>
          <li><span className="tick">✓</span> AI-generated creative variations tested daily</li>
          <li><span className="tick">✓</span> Full-funnel tracking from click to conversion</li>
        </ul>
        <a href="#" className="bp">See Our Ad Results
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>

      <div className="right">
        <div className="roasbadge">
          <span className="lbl">ROAS</span>
          <span className="v" ref={roasRef}>0.0×</span>
          <span className="ar">↑</span>
        </div>

        <div className="screen">
          <div className="topbar">
            <div className="metalogo"><span className="m">M</span> Ads Manager</div>
            <span className="tag">· Knowledge World24 — Client Campaign</span>
            <span className="live"><span className="ld"></span> LIVE</span>
          </div>

          <div className="dash-inner">
            <div className="kpis">
              <div className="kpi">
                <div className="label">Amount Spent</div>
                <div className="val" ref={spendRef}>₹0</div>
                <div className="delta">↑ optimised</div>
              </div>
              <div className="kpi">
                <div className="label">Conversions</div>
                <div className="val" ref={convRef}>0</div>
                <div className="delta" ref={convDRef}>↑ 0%</div>
              </div>
              <div className="kpi">
                <div className="label">Revenue</div>
                <div className="val" ref={revRef}>₹0</div>
                <div className="delta">↑ live</div>
              </div>
              <div className="kpi">
                <div className="label">Cost / Result</div>
                <div className="val" ref={cpaRef}>₹0</div>
                <div className="delta" ref={cpaDRef}>↓ improving</div>
              </div>
            </div>

            <div className="chartcard">
              <div className="ch-head">
                <div className="ch-title">Conversions — Last 14 Days</div>
                <div className="ch-legend">
                  <span><span className="dot8" style={{ background: 'var(--accent-d)' }}></span> This campaign</span>
                  <span><span className="dot8" style={{ background: 'var(--meta-blue)', opacity: .55 }}></span> Previous</span>
                </div>
              </div>
              <svg className="chart" viewBox="0 0 460 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="goldgrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2e9e73" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#2e9e73" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line className="gridline" x1="0" y1="30" x2="460" y2="30" />
                <line className="gridline" x1="0" y1="60" x2="460" y2="60" />
                <line className="gridline" x1="0" y1="90" x2="460" y2="90" />
                <polygon className="area" ref={areaRef} points="" />
                <polyline className="line2" ref={line2Ref} points="" />
                <polyline className="line" ref={line1Ref} points="" />
              </svg>
            </div>

            <div className="ads-label">Top Performing Creatives</div>
            <div className="adrow" ref={adrowRef}></div>
          </div>
        </div>
      </div>
      </div>

      <style jsx global>{`
        .kw24-meta-ads.sec { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 90px 56px; position: relative; overflow: hidden; --accent-d: #1f7355; --meta-blue: #1877f2; --green: #42b72a; }
        .kw24-meta-ads .meta-inner { position: relative; z-index: 3; width: 100%; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 48px; align-items: center; }
        .kw24-meta-ads.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#101512 1px, transparent 1px), linear-gradient(90deg, #101512 1px, transparent 1px); background-size: 46px 46px; opacity: .5; -webkit-mask-image: radial-gradient(ellipse 90% 80% at 40% 50%, #000 35%, transparent 100%); mask-image: radial-gradient(ellipse 90% 80% at 40% 50%, #000 35%, transparent 100%); z-index: 0; }

        .kw24-meta-ads .left { position: relative; z-index: 3; }
        .kw24-meta-ads .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #222; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(255,255,255,.42); letter-spacing: .5px; margin-bottom: 26px; }
        .kw24-meta-ads .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: metaBlink 1.4s infinite; }
        @keyframes metaBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-meta-ads h2 { font-family: var(--display); font-size: clamp(32px,3.4vw,52px); font-weight: 800; line-height: 1.04; letter-spacing: -1.6px; margin-bottom: 20px; }
        .kw24-meta-ads h2 .g { color: var(--ivory); }
        .kw24-meta-ads .sub { font-size: 16px; font-weight: 300; color: rgba(255,255,255,.42); line-height: 1.7; max-width: 400px; margin-bottom: 30px; }
        .kw24-meta-ads .points { list-style: none; display: flex; flex-direction: column; gap: 14px; margin-bottom: 34px; }
        .kw24-meta-ads .points li { display: flex; align-items: center; gap: 12px; font-size: 14px; color: rgba(255,255,255,.7); }
        .kw24-meta-ads .points .tick { width: 20px; height: 20px; border-radius: 50%; background: rgba(46,158,115,.12); border: 1px solid var(--accent); color: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; }
        .kw24-meta-ads .bp { display: inline-flex; align-items: center; gap: 9px; background: var(--accent); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 14px 26px; border-radius: 3px; text-decoration: none; transition: opacity .2s; }
        .kw24-meta-ads .bp:hover { opacity: .85; }

        .kw24-meta-ads .right { position: relative; z-index: 3; min-width: 0; }
        .kw24-meta-ads .screen { background: #f0f2f5; border-radius: 12px; overflow: hidden; box-shadow: 0 40px 120px rgba(46,158,115,.12), 0 20px 60px rgba(0,0,0,.6); }
        .kw24-meta-ads .topbar { display: flex; align-items: center; gap: 10px; padding: 11px 16px; background: #fff; border-bottom: 1px solid #dadde1; }
        .kw24-meta-ads .metalogo { display: flex; align-items: center; gap: 8px; font-family: var(--ui); font-weight: 700; font-size: 14px; color: #1c1e21; }
        .kw24-meta-ads .metalogo .m { width: 24px; height: 24px; border-radius: 6px; background: var(--meta-blue); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 14px; }
        .kw24-meta-ads .topbar .tag { font-family: var(--ui); font-size: 11px; color: #65676b; margin-left: 4px; }
        .kw24-meta-ads .live { margin-left: auto; display: flex; align-items: center; gap: 6px; font-family: var(--ui); font-size: 11px; color: #42b72a; font-weight: 500; }
        .kw24-meta-ads .live .ld { width: 7px; height: 7px; border-radius: 50%; background: #42b72a; animation: metaBlink 1.2s infinite; }

        .kw24-meta-ads .dash-inner { padding: 18px; }
        .kw24-meta-ads .kpis { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
        .kw24-meta-ads .kpi { background: #fff; border: 1px solid #e4e6eb; border-radius: 8px; padding: 13px; }
        .kw24-meta-ads .kpi .label { font-family: var(--ui); font-size: 10px; color: #65676b; text-transform: uppercase; letter-spacing: .4px; margin-bottom: 7px; }
        .kw24-meta-ads .kpi .val { font-family: var(--display); font-size: 24px; font-weight: 800; color: #1c1e21; line-height: 1; }
        .kw24-meta-ads .kpi .delta { font-family: var(--ui); font-size: 11px; font-weight: 500; color: #42b72a; margin-top: 5px; display: flex; align-items: center; gap: 3px; }

        .kw24-meta-ads .chartcard { background: #fff; border: 1px solid #e4e6eb; border-radius: 8px; padding: 15px 16px; margin-bottom: 16px; }
        .kw24-meta-ads .chartcard .ch-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; }
        .kw24-meta-ads .chartcard .ch-title { font-family: var(--ui); font-size: 12px; font-weight: 700; color: #1c1e21; }
        .kw24-meta-ads .chartcard .ch-legend { display: flex; gap: 14px; font-family: var(--ui); font-size: 10px; color: #65676b; }
        .kw24-meta-ads .chartcard .ch-legend span { display: flex; align-items: center; gap: 5px; }
        .kw24-meta-ads .dot8 { width: 8px; height: 8px; border-radius: 2px; }
        .kw24-meta-ads svg.chart { width: 100%; height: 120px; display: block; overflow: visible; }
        .kw24-meta-ads .gridline { stroke: #eef0f2; stroke-width: 1; }
        .kw24-meta-ads .area { fill: url(#goldgrad); }
        .kw24-meta-ads .line { fill: none; stroke: var(--accent-d); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: metaDraw 2.4s ease forwards .4s; }
        .kw24-meta-ads .line2 { fill: none; stroke: var(--meta-blue); stroke-width: 2; stroke-linecap: round; opacity: .55; stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: metaDraw 2.4s ease forwards .7s; }
        @keyframes metaDraw { to { stroke-dashoffset: 0; } }

        .kw24-meta-ads .ads-label { font-family: var(--ui); font-size: 11px; color: #65676b; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 10px; }
        .kw24-meta-ads .adrow { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
        .kw24-meta-ads .adcard { background: #fff; border: 1px solid #e4e6eb; border-radius: 8px; overflow: hidden; opacity: 0; transform: translateY(14px); }
        .kw24-meta-ads .adcard .ad-top { display: flex; align-items: center; gap: 7px; padding: 8px 9px; }
        .kw24-meta-ads .adcard .ad-av { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--ui); font-weight: 700; font-size: 10px; color: #fff; }
        .kw24-meta-ads .adcard .ad-brand { font-family: var(--ui); font-size: 11px; font-weight: 700; color: #1c1e21; line-height: 1.1; }
        .kw24-meta-ads .adcard .ad-spon { font-family: var(--ui); font-size: 9px; color: #65676b; }
        .kw24-meta-ads .adcard .ad-img { height: 96px; position: relative; display: flex; align-items: flex-end; overflow: hidden; padding: 10px 12px; border-top: 1px solid rgba(46,158,115,.18); }
        .kw24-meta-ads .adcard .ad-img::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 28% 18%, rgba(255,255,255,.22), transparent 55%); }
        .kw24-meta-ads .adcard .ad-img::after { content: ''; position: absolute; inset: 0; box-shadow: inset 0 -34px 30px -14px rgba(0,0,0,.5); }
        .kw24-meta-ads .adcard .ad-icon { position: absolute; top: 10px; right: 10px; z-index: 1; opacity: .85; }
        .kw24-meta-ads .adcard .ad-img .prod { position: relative; z-index: 1; font-family: var(--display); font-weight: 700; font-size: 12.5px; letter-spacing: .1px; line-height: 1.25; color: #fff; text-shadow: 0 2px 8px rgba(0,0,0,.55); }
        .kw24-meta-ads .adcard .ad-cta { display: flex; align-items: center; justify-content: space-between; padding: 8px 9px; background: #f7f8fa; border-top: 1px solid #e4e6eb; }
        .kw24-meta-ads .adcard .ad-cta .txt { font-family: var(--ui); font-size: 10px; color: #1c1e21; font-weight: 500; }
        .kw24-meta-ads .adcard .ad-cta .btn { font-family: var(--ui); font-size: 9px; font-weight: 700; color: #fff; background: var(--meta-blue); padding: 4px 8px; border-radius: 4px; }
        .kw24-meta-ads .adcard .ad-stats { display: flex; gap: 10px; padding: 7px 9px; font-family: var(--ui); font-size: 9px; color: #65676b; }
        .kw24-meta-ads .adcard .ad-stats b { color: #42b72a; }

        .kw24-meta-ads .roasbadge { position: absolute; top: -54px; right: 24px; z-index: 6; background: #0b1d17; border: 1px solid var(--accent); border-radius: 100px; padding: 8px 18px; display: flex; align-items: center; gap: 10px; box-shadow: 0 0 30px rgba(46,158,115,.3); }
        .kw24-meta-ads .roasbadge .lbl { font-size: 11px; color: rgba(255,255,255,.42); }
        .kw24-meta-ads .roasbadge .v { font-family: var(--display); font-size: 18px; font-weight: 800; color: var(--accent); min-width: 46px; text-align: center; }
        .kw24-meta-ads .roasbadge .ar { color: #42b72a; font-size: 13px; }

        @media (max-width: 980px) {
          .kw24-meta-ads.sec { padding: 70px 22px; }
          .kw24-meta-ads .meta-inner { grid-template-columns: 1fr; }
          .kw24-meta-ads .kpis { grid-template-columns: repeat(2,1fr); }
          .kw24-meta-ads .adrow { grid-template-columns: repeat(2,1fr); }
          .kw24-meta-ads .roasbadge { position: static; align-self: flex-start; margin-bottom: 14px; }
          .kw24-meta-ads .right { display: flex; flex-direction: column; }
          .kw24-meta-ads .topbar .tag { display: none; }
        }

        @media (max-width: 560px) {
          .kw24-meta-ads .adrow { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
