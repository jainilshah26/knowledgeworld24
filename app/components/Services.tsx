'use client'

import { useEffect, useRef } from 'react'

interface Service {
  num: string
  icon: React.ReactNode
  title: string
  desc: string
  statNum: string
  statLabel: string
}

const SERVICES: Service[] = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    title: 'SEO & AI Search',
    desc: 'Technical audits, content strategy, and AI-driven optimisation that climbs you from page 2 to rank #1.',
    statNum: '#1.8',
    statLabel: 'avg. position',
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
    ),
    title: 'AI Automation',
    desc: 'n8n workflows and AI agents that qualify leads and run outreach — scaling without headcount.',
    statNum: '24/7',
    statLabel: 'agent uptime',
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M18 20V10M12 20V4M6 20v-6" /></svg>
    ),
    title: 'Performance Marketing',
    desc: 'Meta, Google & LinkedIn ads managed with precision — every rupee tracked and optimised.',
    statNum: '5.8×',
    statLabel: 'avg. ROAS',
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
    ),
    title: 'Social Media',
    desc: 'Content calendars and community management that compound into real brand equity.',
    statNum: '3.2×',
    statLabel: 'engagement lift',
  },
  {
    num: '05',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /></svg>
    ),
    title: 'Content Marketing',
    desc: 'Blogs and thought leadership written for humans, structured for AI search engines.',
    statNum: '340%',
    statLabel: 'traffic lift',
  },
  {
    num: '06',
    icon: (
      <svg viewBox="0 0 24 24"><polygon points="23,7 16,12 23,17" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
    ),
    title: 'Video Production',
    desc: 'Short-form videos engineered to stop the scroll and drive real action.',
    statNum: '8.4%',
    statLabel: 'avg. CTR',
  },
]

export default function Services() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const prevBtnRef = useRef<HTMLDivElement>(null)
  const nextBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const dotsEl = dotsRef.current
    const prevBtn = prevBtnRef.current
    const nextBtn = nextBtnRef.current
    if (!wrap || !track || !dotsEl || !prevBtn || !nextBtn) return

    // grab this component's styled-jsx scoping class so dynamically-created
    // dot elements (not part of the JSX tree) still receive the scoped styles
    const jsxScope = [...dotsEl.classList].find(c => c.startsWith('jsx-'))

    const originalCards = [...track.children] as HTMLElement[]
    const cardW = 340 + 20
    let index = 0
    const realCount = originalCards.length

    // clone first two cards to the end for a seamless infinite loop
    const clones: HTMLElement[] = []
    originalCards.slice(0, 2).forEach(c => {
      const clone = c.cloneNode(true) as HTMLElement
      clone.setAttribute('data-clone', 'true')
      track.appendChild(clone)
      clones.push(clone)
    })

    const dotEls: HTMLDivElement[] = []
    const dotClickHandlers: (() => void)[] = []
    for (let i = 0; i < realCount; i++) {
      const d = document.createElement('div')
      d.className = 'dot' + (jsxScope ? ' ' + jsxScope : '') + (i === 0 ? ' active' : '')
      const handler = () => { stopAuto(); go(i); startAuto() }
      d.addEventListener('click', handler)
      dotsEl.appendChild(d)
      dotEls.push(d)
      dotClickHandlers.push(handler)
    }

    function updateDots() {
      const real = ((index % realCount) + realCount) % realCount
      dotEls.forEach((d, i) => d.classList.toggle('active', i === real))
    }

    function go(i: number, instant?: boolean) {
      index = i
      track!.style.transition = instant ? 'none' : 'transform .6s cubic-bezier(.6,.01,.05,.95)'
      track!.style.transform = `translateX(${-index * cardW}px)`
      updateDots()
    }

    // when we scroll past the real cards into the clones, snap back invisibly
    const onTransitionEnd = () => {
      if (index >= realCount) {
        go(index - realCount, true)
      }
    }
    track.addEventListener('transitionend', onTransitionEnd)

    const onNextClick = () => { stopAuto(); go(index + 1); startAuto() }
    const onPrevClick = () => { stopAuto(); go(index <= 0 ? realCount - 1 : index - 1); startAuto() }
    nextBtn.addEventListener('click', onNextClick)
    prevBtn.addEventListener('click', onPrevClick)

    // auto-swipe every 2 seconds
    let autoTimer: ReturnType<typeof setInterval> | null = null
    function startAuto() {
      stopAuto()
      autoTimer = setInterval(() => { go(index + 1) }, 2000)
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null }
    }

    // pause on hover
    wrap.addEventListener('mouseenter', stopAuto)
    wrap.addEventListener('mouseleave', startAuto)

    // drag support
    let isDown = false, startX = 0, scrollStart = 0
    const onMouseDown = (e: MouseEvent) => {
      isDown = true
      stopAuto()
      wrap!.classList.add('dragging')
      startX = e.pageX
      scrollStart = -index * cardW
      track!.style.transition = 'none'
    }
    const onWindowMouseUpDrag = () => {
      if (isDown) { isDown = false; wrap!.classList.remove('dragging') }
    }
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDown) return
      const dx = e.pageX - startX
      track!.style.transform = `translateX(${scrollStart + dx}px)`
    }
    const onWindowMouseUpSnap = (e: MouseEvent) => {
      if (!isDown) return
      const dx = e.pageX - startX
      if (dx < -60) go(index + 1)
      else if (dx > 60) go(index <= 0 ? realCount - 1 : index - 1)
      else go(index)
      startAuto()
    }
    wrap.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onWindowMouseUpDrag)
    window.addEventListener('mousemove', onWindowMouseMove)
    window.addEventListener('mouseup', onWindowMouseUpSnap)

    // touch support (mobile swipe)
    let touchStartX = 0
    const onTouchStart = (e: TouchEvent) => {
      stopAuto()
      touchStartX = e.touches[0].clientX
      track!.style.transition = 'none'
      scrollStart = -index * cardW
    }
    const onTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX
      track!.style.transform = `translateX(${scrollStart + dx}px)`
    }
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchStartX
      if (dx < -40) go(index + 1)
      else if (dx > 40) go(index <= 0 ? realCount - 1 : index - 1)
      else go(index)
      startAuto()
    }
    wrap.addEventListener('touchstart', onTouchStart, { passive: true })
    wrap.addEventListener('touchmove', onTouchMove, { passive: true })
    wrap.addEventListener('touchend', onTouchEnd)

    go(0, true)
    startAuto()

    return () => {
      stopAuto()

      track.removeEventListener('transitionend', onTransitionEnd)
      nextBtn.removeEventListener('click', onNextClick)
      prevBtn.removeEventListener('click', onPrevClick)

      wrap.removeEventListener('mouseenter', stopAuto)
      wrap.removeEventListener('mouseleave', startAuto)

      wrap.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onWindowMouseUpDrag)
      window.removeEventListener('mousemove', onWindowMouseMove)
      window.removeEventListener('mouseup', onWindowMouseUpSnap)

      wrap.removeEventListener('touchstart', onTouchStart)
      wrap.removeEventListener('touchmove', onTouchMove)
      wrap.removeEventListener('touchend', onTouchEnd)

      dotEls.forEach((d, i) => d.removeEventListener('click', dotClickHandlers[i]))
      dotsEl.innerHTML = ''
      clones.forEach(c => c.remove())
      track.style.transition = ''
      track.style.transform = ''
    }
  }, [])

  return (
    <section
      id="services"
      className="sec"
      style={{
        ['--grid' as string]: '#101512',
        ['--muted' as string]: 'rgba(255,255,255,.45)',
        ['--card' as string]: '#0a0f0c',
        ['--card-b' as string]: '#1a2420',
      }}
    >
      <div className="head">
        <div>
          <div className="badge"><i></i> What We Do</div>
          <h2>Services Built For <span className="g">Compounding Growth.</span></h2>
        </div>
        <div className="nav-arrows">
          <div className="arrow" id="prevBtn" ref={prevBtnRef}><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg></div>
          <div className="arrow" id="nextBtn" ref={nextBtnRef}><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg></div>
        </div>
      </div>

      <div className="track-wrap" id="wrap" ref={wrapRef}>
        <div className="track" id="track" ref={trackRef}>
          {SERVICES.map(svc => (
            <div className="card" key={svc.num}>
              <div className="num">{svc.num}</div>
              <div className="icowrap">{svc.icon}</div>
              <div className="ctitle">{svc.title}</div>
              <div className="cdesc">{svc.desc}</div>
              <div className="stat-row"><span className="stat-num">{svc.statNum}</span><span className="stat-label">{svc.statLabel}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div className="dots" id="dots" ref={dotsRef}></div>

      <style jsx>{`
        .sec{position:relative;padding:120px 0;overflow:hidden}
        .sec::before{content:'';position:absolute;inset:0;background-image:linear-gradient(var(--grid) 1px,transparent 1px),linear-gradient(90deg,var(--grid) 1px,transparent 1px);background-size:46px 46px;opacity:.35;z-index:0}

        .head{position:relative;z-index:2;max-width:1240px;margin:0 auto 48px;padding:0 56px;display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap}
        .badge{display:inline-flex;align-items:center;gap:8px;border:1px solid #222;padding:6px 14px;border-radius:100px;font-size:11px;color:var(--muted);letter-spacing:.5px;margin-bottom:22px}
        .badge i{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:blink 1.4s infinite}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.2}}
        h2{font-family:var(--display);font-size:clamp(30px,3.6vw,50px);font-weight:800;letter-spacing:-1.5px;line-height:1.08}
        h2 .g{color:var(--ivory)}
        .nav-arrows{display:flex;gap:10px}
        .arrow{width:46px;height:46px;border-radius:50%;border:1px solid var(--card-b);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .25s;background:var(--card)}
        .arrow:hover{border-color:var(--accent);background:rgba(46,158,115,.08)}
        .arrow svg{width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round}

        .track-wrap{position:relative;z-index:2;overflow:hidden;padding:8px 56px 24px;cursor:grab}
        .track-wrap.dragging{cursor:grabbing}
        .track{display:flex;gap:20px;will-change:transform}

        .card{flex:0 0 340px;background:var(--card);border:1px solid var(--card-b);border-radius:16px;padding:30px;display:flex;flex-direction:column;min-height:400px;position:relative;overflow:hidden;user-select:none;transition:border-color .3s}
        .card:hover{border-color:rgba(46,158,115,.35)}
        .num{font-family:var(--mono);font-size:38px;font-weight:400;color:rgba(255,255,255,.06);position:absolute;top:18px;right:22px;line-height:1}
        .icowrap{width:48px;height:48px;border-radius:12px;background:rgba(46,158,115,.08);border:1px solid rgba(46,158,115,.2);display:flex;align-items:center;justify-content:center;margin-bottom:24px;position:relative;z-index:1}
        .icowrap :global(svg){width:23px;height:23px;stroke:var(--accent);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
        .ctitle{font-family:var(--display);font-size:21px;font-weight:700;letter-spacing:-.3px;margin-bottom:12px;position:relative;z-index:1}
        .cdesc{font-size:13.5px;color:var(--muted);line-height:1.7;font-weight:300;margin-bottom:24px;position:relative;z-index:1}
        .stat-row{margin-top:auto;padding-top:16px;border-top:1px solid var(--card-b);display:flex;align-items:baseline;gap:8px}
        .stat-num{font-family:var(--display);font-weight:800;color:var(--accent);font-size:26px}
        .stat-label{font-family:var(--mono);font-size:10px;color:var(--muted)}

        .dots{display:flex;justify-content:center;gap:8px;margin-top:32px;position:relative;z-index:2}
        .dot{width:6px;height:6px;border-radius:50%;background:var(--card-b);transition:all .3s;cursor:pointer}
        .dot.active{background:var(--accent);width:22px;border-radius:3px}

        @media(max-width:640px){
          .head{padding:0 22px}.track-wrap{padding:8px 22px 24px}
          .card{flex-basis:280px;min-height:360px}
        }
      `}</style>
    </section>
  )
}
