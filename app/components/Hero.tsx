'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Hero() {
  const curRef = useRef<HTMLDivElement>(null)
  const cur2Ref = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    /* ---------- custom cursor + magnetic buttons ---------- */
    const cur = curRef.current
    const cur2 = cur2Ref.current
    let cmx = 0, cmy = 0, rx = 0, ry = 0

    const onMouseMove = (e: MouseEvent) => {
      cmx = e.clientX
      cmy = e.clientY
      if (cur) { cur.style.left = cmx + 'px'; cur.style.top = cmy + 'px' }
    }
    document.addEventListener('mousemove', onMouseMove)

    let ringRaf = 0
    function ring() {
      rx += (cmx - rx) * .18
      ry += (cmy - ry) * .18
      if (cur2) { cur2.style.left = rx + 'px'; cur2.style.top = ry + 'px' }
      ringRaf = requestAnimationFrame(ring)
    }
    ring()

    const hoverEls = Array.from(document.querySelectorAll<HTMLElement>('a,[data-magnet]'))
    const onEnter = () => {
      if (cur) { cur.style.width = '14px'; cur.style.height = '14px' }
      if (cur2) { cur2.style.width = '46px'; cur2.style.height = '46px'; cur2.style.borderColor = 'rgba(201,166,107,.7)' }
    }
    const leaveHandlers = new Map<HTMLElement, () => void>()
    hoverEls.forEach(el => {
      const onLeave = () => {
        if (cur) { cur.style.width = '7px'; cur.style.height = '7px' }
        if (cur2) { cur2.style.width = '30px'; cur2.style.height = '30px'; cur2.style.borderColor = 'rgba(201,166,107,.4)' }
        el.style.transform = ''
      }
      leaveHandlers.set(el, onLeave)
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    const magnetEls = Array.from(document.querySelectorAll<HTMLElement>('[data-magnet]'))
    const magnetHandlers = new Map<HTMLElement, (e: MouseEvent) => void>()
    magnetEls.forEach(el => {
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        el.style.transform = `translate(${x * .3}px,${y * .4}px)`
      }
      magnetHandlers.set(el, onMove)
      el.addEventListener('mousemove', onMove)
    })

    /* ---------- Three.js data network ---------- */
    const canvas = canvasRef.current
    const hero = heroRef.current

    let renderer: THREE.WebGLRenderer | null = null
    let running = true
    let animFrame = 0
    let onResize: (() => void) | null = null
    let onHeroMove: ((e: MouseEvent) => void) | null = null
    let onHeroLeave: (() => void) | null = null
    let onVisibility: (() => void) | null = null
    let pGeo: THREE.BufferGeometry | null = null
    let lGeo: THREE.BufferGeometry | null = null
    let pointsMat: THREE.PointsMaterial | null = null
    let linesMat: THREE.LineBasicMaterial | null = null
    let icoGeo: THREE.IcosahedronGeometry | null = null
    let icoMat: THREE.MeshBasicMaterial | null = null

    if (canvas && hero) {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x050506, 0.0065)
      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 500)
      camera.position.set(0, 0, 90)

      function size() {
        if (!renderer || !hero) return
        const w = hero.clientWidth, h = hero.clientHeight
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      size()
      onResize = size
      addEventListener('resize', onResize)

      const N = 110
      const P = new Float32Array(N * 3)
      const V = new Float32Array(N * 3)
      for (let i = 0; i < N; i++) {
        P[i * 3] = (Math.random() - .5) * 160
        P[i * 3 + 1] = (Math.random() - .5) * 110
        P[i * 3 + 2] = (Math.random() - .5) * 90 - 10
        V[i * 3] = (Math.random() - .5) * .06
        V[i * 3 + 1] = (Math.random() - .5) * .06
        V[i * 3 + 2] = (Math.random() - .5) * .04
      }
      pGeo = new THREE.BufferGeometry()
      pGeo.setAttribute('position', new THREE.BufferAttribute(P, 3))
      pointsMat = new THREE.PointsMaterial({ color: 0xc9a66b, size: 1.5, transparent: true, opacity: .9, blending: THREE.AdditiveBlending, depthWrite: false, fog: true })
      const points = new THREE.Points(pGeo, pointsMat)
      scene.add(points)

      const MAXSEG = N * 6
      const lp = new Float32Array(MAXSEG * 6)
      lGeo = new THREE.BufferGeometry()
      lGeo.setAttribute('position', new THREE.BufferAttribute(lp, 3))
      linesMat = new THREE.LineBasicMaterial({ color: 0xc9a66b, transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, fog: true })
      const lines = new THREE.LineSegments(lGeo, linesMat)
      scene.add(lines)

      icoGeo = new THREE.IcosahedronGeometry(24, 1)
      icoMat = new THREE.MeshBasicMaterial({ color: 0xc9a66b, wireframe: true, transparent: true, opacity: .1, fog: true })
      const ico = new THREE.Mesh(icoGeo, icoMat)
      ico.position.set(20, 0, -25)
      scene.add(ico)

      let mx = 0, my = 0, tcx = 0, tcy = 0
      onHeroMove = (e: MouseEvent) => {
        const r = hero.getBoundingClientRect()
        mx = ((e.clientX - r.left) / r.width - .5) * 2
        my = ((e.clientY - r.top) / r.height - .5) * 2
      }
      onHeroLeave = () => { mx = 0; my = 0 }
      hero.addEventListener('mousemove', onHeroMove)
      hero.addEventListener('mouseleave', onHeroLeave)

      const TH = 26, TH2 = TH * TH
      onVisibility = () => { running = !document.hidden; if (running) animate() }
      document.addEventListener('visibilitychange', onVisibility)

      function animate() {
        if (!running || !renderer || !pGeo || !lGeo) return
        animFrame = requestAnimationFrame(animate)
        for (let i = 0; i < N; i++) {
          P[i * 3] += V[i * 3]; P[i * 3 + 1] += V[i * 3 + 1]; P[i * 3 + 2] += V[i * 3 + 2]
          if (P[i * 3] > 80 || P[i * 3] < -80) V[i * 3] *= -1
          if (P[i * 3 + 1] > 55 || P[i * 3 + 1] < -55) V[i * 3 + 1] *= -1
          if (P[i * 3 + 2] > 40 || P[i * 3 + 2] < -60) V[i * 3 + 2] *= -1
        }
        pGeo.attributes.position.needsUpdate = true
        let s = 0
        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = P[i * 3] - P[j * 3], dy = P[i * 3 + 1] - P[j * 3 + 1], dz = P[i * 3 + 2] - P[j * 3 + 2]
            const d2 = dx * dx + dy * dy + dz * dz
            if (d2 < TH2 && s < MAXSEG) {
              lp[s * 6] = P[i * 3]; lp[s * 6 + 1] = P[i * 3 + 1]; lp[s * 6 + 2] = P[i * 3 + 2]
              lp[s * 6 + 3] = P[j * 3]; lp[s * 6 + 4] = P[j * 3 + 1]; lp[s * 6 + 5] = P[j * 3 + 2]
              s++
            }
          }
        }
        lGeo.setDrawRange(0, s * 2)
        lGeo.attributes.position.needsUpdate = true
        points.rotation.y += 0.0004
        ico.rotation.x += 0.0024
        ico.rotation.y += 0.003
        tcx += (mx - tcx) * .05
        tcy += (my - tcy) * .05
        camera.position.x = tcx * 12
        camera.position.y = -tcy * 8
        camera.lookAt(0, 0, 0)
        renderer.render(scene, camera)
      }
      animate()
    }

    return () => {
      timeouts.forEach(clearTimeout)
      cancelAnimationFrame(ringRaf)
      cancelAnimationFrame(animFrame)

      document.removeEventListener('mousemove', onMouseMove)
      leaveHandlers.forEach((fn, el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', fn)
      })
      magnetHandlers.forEach((fn, el) => el.removeEventListener('mousemove', fn))

      if (onResize) removeEventListener('resize', onResize)
      if (hero && onHeroMove) hero.removeEventListener('mousemove', onHeroMove)
      if (hero && onHeroLeave) hero.removeEventListener('mouseleave', onHeroLeave)
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)

      pGeo?.dispose()
      lGeo?.dispose()
      pointsMat?.dispose()
      linesMat?.dispose()
      icoGeo?.dispose()
      icoMat?.dispose()
      renderer?.dispose()
    }
  }, [])

  return (
    <>
      <div ref={curRef} id="cur" />
      <div ref={cur2Ref} id="cur2" />

      <section className="hero" id="hero" ref={heroRef}>
        <canvas id="bg3d" ref={canvasRef} />

        <div className="hero-inner">
        <div className="left">
          <div className="badge"><i></i> Agentic SEO that actually ranks</div>
          <h1>
            <span className="reveal"><span>We Take You</span></span>
            <span className="reveal"><span>From <span className="c">Page 2</span></span></span>
            <span className="reveal"><span>To <span className="c">Rank #1.</span></span></span>
          </h1>
          <div className="rule" />
          <p className="sub">Our AI agents reverse-engineer the SERP, close your content gaps, and climb you to the top of Google — then keep you there. Watch it happen →</p>
          <div className="actions">
            <a href="#contact" className="bp" data-magnet>Get Free Audit
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
            <a href="#services" className="bs" data-magnet>See Our Services</a>
          </div>
        </div>
        </div>
      </section>

      <style jsx global>{`
        #cur { position: fixed; width: 7px; height: 7px; background: var(--gold); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); transition: width .25s, height .25s, opacity .25s; }
        #cur2 { position: fixed; width: 30px; height: 30px; border: 1px solid rgba(201,166,107,.4); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); transition: left .12s ease-out, top .12s ease-out, width .25s, height .25s, border-color .25s; }
        @media (hover: none) { #cur, #cur2 { display: none; } }

        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 120px 56px 70px; position: relative; overflow: hidden; perspective: 1600px; }
        .hero-inner { position: relative; z-index: 3; width: 100%; max-width: 1280px; margin: 0 auto; display: flex; justify-content: center; }
        #bg3d { position: absolute; inset: 0; z-index: 0; display: block; }
        .hero::after { content: ''; position: absolute; inset: 0; z-index: 1; background: radial-gradient(ellipse 65% 60% at 50% 45%, transparent 40%, rgba(5,5,6,.62) 100%); pointer-events: none; }

        .hero .left { position: relative; z-index: 3; max-width: 720px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .hero .reveal { overflow: hidden; display: block; width: fit-content; margin: 0 auto; }
        .hero .reveal > * { display: block; transform: translateY(110%); animation: heroLineUp .9s var(--ease) forwards; }
        @keyframes heroLineUp { to { transform: translateY(0); } }
        .hero .badge { display: inline-flex; align-items: center; gap: 9px; border: 1px solid rgba(201,166,107,.3); background: rgba(11,11,13,.6); padding: 7px 16px; border-radius: 100px; font-size: 11px; letter-spacing: 1.2px; text-transform: uppercase; color: rgba(255,255,255,.5); margin-bottom: 30px; opacity: 0; animation: heroFade .8s ease .2s forwards; }
        .hero .badge i { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: heroBlink 1.4s infinite; }
        @keyframes heroBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        @keyframes heroFade { to { opacity: 1; } }
        .hero h1 { font-family: var(--display); font-size: clamp(38px,4.4vw,64px); font-weight: 800; line-height: 1.06; letter-spacing: -1.8px; margin-bottom: 8px; }
        .hero h1 .c { color: var(--gold); }
        .hero h1 .reveal > span { animation-delay: .35s; }
        .hero h1 .reveal:nth-child(2) > span { animation-delay: .45s; }
        .hero h1 .reveal:nth-child(3) > span { animation-delay: .55s; }
        .hero .rule { width: 60px; height: 1px; background: linear-gradient(90deg,transparent,var(--gold),transparent); margin: 26px 0; opacity: 0; animation: heroFade .9s ease .75s forwards; }
        .hero .sub { font-size: 16.5px; font-weight: 300; color: rgba(255,255,255,.46); line-height: 1.75; max-width: 460px; margin: 0 auto 38px; opacity: 0; animation: heroFade .9s ease .85s forwards; }
        .hero .actions { display: flex; justify-content: center; gap: 13px; opacity: 0; animation: heroFade .9s ease 1s forwards; }
        .hero .bp { display: inline-flex; align-items: center; gap: 9px; background: linear-gradient(135deg,#e8d4a8,var(--gold) 60%,#8c6f3e); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 15px 30px; border-radius: 3px; text-decoration: none; transition: box-shadow .3s; will-change: transform; }
        .hero .bp:hover { box-shadow: 0 0 44px rgba(201,166,107,.5); }
        .hero .bs { display: inline-flex; align-items: center; color: rgba(255,255,255,.46); font-size: 13px; letter-spacing: .3px; padding: 15px 22px; border: 1px solid #262629; background: rgba(11,11,13,.5); border-radius: 3px; text-decoration: none; transition: all .3s; will-change: transform; }
        .hero .bs:hover { color: #fff; border-color: rgba(201,166,107,.5); }

        @media (max-width: 980px) {
          .hero { padding: 100px 22px 50px; }
        }
      `}</style>
    </>
  )
}
