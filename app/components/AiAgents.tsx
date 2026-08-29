'use client'

import { useEffect, useRef } from 'react'

export default function AiAgents() {
  const cvbodyRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const packetRef = useRef<SVGCircleElement>(null)
  const p1Ref = useRef<SVGPathElement>(null)
  const p2Ref = useRef<SVGPathElement>(null)
  const p3Ref = useRef<SVGPathElement>(null)
  const p4Ref = useRef<SVGPathElement>(null)
  const n1Ref = useRef<HTMLDivElement>(null)
  const n2Ref = useRef<HTMLDivElement>(null)
  const n3Ref = useRef<HTMLDivElement>(null)
  const n4Ref = useRef<HTMLDivElement>(null)
  const n5Ref = useRef<HTMLDivElement>(null)
  const c2Ref = useRef<HTMLDivElement>(null)
  const c3Ref = useRef<HTMLDivElement>(null)
  const leadcountRef = useRef<HTMLSpanElement>(null)
  const pipelineRef = useRef<HTMLSpanElement>(null)
  const footlogRef = useRef<HTMLSpanElement>(null)
  const seoTaskRef = useRef<HTMLDivElement>(null)
  const contentTaskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const intervals: ReturnType<typeof setInterval>[] = []
    const rafs: number[] = []
    const runTimeout = (fn: () => void, ms: number) => { const t = setTimeout(fn, ms); timeouts.push(t); return t }
    const runInterval = (fn: () => void, ms: number) => { const t = setInterval(fn, ms); intervals.push(t); return t }

    function fitStage() {
      const body = cvbodyRef.current, stage = stageRef.current
      if (!body || !stage) return
      const scale = Math.min(1, body.clientWidth / 600)
      stage.style.transform = 'scale(' + scale + ')'
      body.style.height = (320 * scale) + 'px'
    }
    window.addEventListener('resize', fitStage)
    fitStage()

    const nodeRefs = [n1Ref, n2Ref, n3Ref, n4Ref, n5Ref]
    nodeRefs.forEach((ref, i) => {
      runTimeout(() => ref.current?.classList.add('show'), 300 + i * 220)
    })

    const paths = [p1Ref, p2Ref, p3Ref, p4Ref]
    const packet = packetRef.current
    const counts = { leads: 0, pipeline: 0, qualified: 0, apollo: 0 }

    function packetTo(pathEl: SVGPathElement | null) {
      if (!pathEl || !packet) return
      const pt = pathEl.getPointAtLength(0)
      packet.setAttribute('cx', String(pt.x))
      packet.setAttribute('cy', String(pt.y))
    }
    function lightNode(i: number) {
      nodeRefs[i]?.current?.classList.add('active')
    }
    function resetLit() {
      nodeRefs.forEach(ref => ref.current?.classList.remove('active'))
    }

    function tally() {
      counts.apollo += Math.floor(Math.random() * 15) + 20
      const newQ = Math.floor(Math.random() * 6) + 5
      counts.qualified += newQ
      counts.leads += newQ
      counts.pipeline += newQ * 8500
      if (c2Ref.current) c2Ref.current.textContent = '+' + counts.apollo + ' leads'
      if (c3Ref.current) c3Ref.current.textContent = counts.qualified + ' qualified'
      if (leadcountRef.current) leadcountRef.current.textContent = String(counts.leads)
      if (pipelineRef.current) pipelineRef.current.textContent = '₹' + (counts.pipeline / 100000).toFixed(1) + 'L'
      if (footlogRef.current) footlogRef.current.textContent = '▸ ' + newQ + ' new qualified leads added ✓'
    }

    function travel(seg: number) {
      if (seg >= paths.length) {
        tally()
        runTimeout(() => { resetLit(); packetTo(p1Ref.current); travel(0) }, 700)
        return
      }
      const pathEl = paths[seg].current
      if (!pathEl) return
      const len = pathEl.getTotalLength()
      const dur = 900
      let start: number | null = null
      lightNode(seg)
      function step(ts: number) {
        if (start === null) start = ts
        const t = Math.min((ts - start) / dur, 1)
        const pt = pathEl!.getPointAtLength(t * len)
        packet?.setAttribute('cx', String(pt.x))
        packet?.setAttribute('cy', String(pt.y))
        if (t < 1) {
          const r = requestAnimationFrame(step)
          rafs.push(r)
        } else {
          lightNode(seg + 1)
          travel(seg + 1)
        }
      }
      const r = requestAnimationFrame(step)
      rafs.push(r)
    }

    const seoTasks = ['Auditing 1,240 URLs…', 'Fixing 38 meta titles…', 'Building schema markup…', 'Closing 89 keyword gaps…']
    const contentTasks = ['Drafting 8 blog posts…', 'Optimising for AEO…', 'Generating 24 captions…', 'Internal linking…']
    let si = 0, ci = 0
    runInterval(() => { si = (si + 1) % seoTasks.length; if (seoTaskRef.current) seoTaskRef.current.textContent = seoTasks[si] }, 2600)
    runInterval(() => { ci = (ci + 1) % contentTasks.length; if (contentTaskRef.current) contentTaskRef.current.textContent = contentTasks[ci] }, 3100)

    runTimeout(() => { packetTo(p1Ref.current); travel(0) }, 1400)

    return () => {
      window.removeEventListener('resize', fitStage)
      timeouts.forEach(clearTimeout)
      intervals.forEach(clearInterval)
      rafs.forEach(cancelAnimationFrame)
    }
  }, [])

  return (
    <section id="ai-automation" className="kw24-ai-agents sec">
      <div className="ai-inner">
      <div className="left">
        <div className="badge"><i></i> Agentic AI Workforce</div>
        <h2>A Team of AI Agents That <span className="g">Never Sleep.</span></h2>
        <p className="sub">While your competitors are offline, our agents are auditing SEO, qualifying leads, and pushing campaigns live — autonomously, 24/7, at machine speed.</p>

        <div className="agent-pills">
          <div className="apill">
            <div className="ico" style={{ background: 'var(--gold)' }}><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3M11 8v6M8 11h6" /></svg></div>
            <div className="meta"><div className="nm">SEO Agent</div><div className="ts" ref={seoTaskRef}>Auditing 1,240 URLs…</div></div>
            <div className="stat"><span className="d"></span>active</div>
          </div>
          <div className="apill">
            <div className="ico" style={{ background: '#5dcaa5' }}><svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg></div>
            <div className="meta"><div className="nm">Lead Gen Agent</div><div className="ts">Running n8n workflow…</div></div>
            <div className="stat"><span className="d"></span>active</div>
          </div>
          <div className="apill">
            <div className="ico" style={{ background: '#85b7eb' }}><svg viewBox="0 0 24 24"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg></div>
            <div className="meta"><div className="nm">Content Agent</div><div className="ts" ref={contentTaskRef}>Drafting 8 blog posts…</div></div>
            <div className="stat"><span className="d"></span>active</div>
          </div>
        </div>

        <a href="#" className="bp">Deploy Agents For Me
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
        </a>
      </div>

      <div className="right">
        <div className="roasbadge"><span className="lbl">Pipeline</span><span className="v" ref={pipelineRef}>₹0</span></div>

        <div className="canvas">
          <div className="cv-bar">
            <div className="cv-title"><span className="wf">n</span> Lead Generation Workflow</div>
            <span className="cv-tag">· built by KW24</span>
            <span className="cv-run"><span className="d"></span> Executing</span>
          </div>

          <div className="cv-body" ref={cvbodyRef}>
            <div className="stage" ref={stageRef}>
              <svg className="flow" viewBox="0 0 600 320">
                <path className="conn" ref={p1Ref} d="M140 77 C 180 77, 182 147, 218 147" />
                <path className="conn" ref={p2Ref} d="M342 147 C 360 147, 360 77, 372 77" />
                <path className="conn" ref={p3Ref} d="M496 77 C 520 77, 522 147, 538 147" />
                <path className="conn" ref={p4Ref} d="M538 182 C 538 250, 330 252, 264 252" />
                <circle className="packet" ref={packetRef} r="4" cx="140" cy="77" />
              </svg>

              <div className="node" ref={n1Ref} style={{ left: 16, top: 44 }}>
                <div className="nh"><div className="nic" style={{ background: '#7f77dd' }}>⏱</div><div className="nt">Schedule<br />Trigger</div></div>
                <div className="nd">Every 1 hour</div>
              </div>
              <div className="node" ref={n2Ref} style={{ left: 218, top: 114 }}>
                <div className="nh"><div className="nic" style={{ background: '#1d9e75' }}>A</div><div className="nt">Apollo.io Search</div></div>
                <div className="nd">People by domain</div>
                <div className="ncount" ref={c2Ref}>+0 leads</div>
              </div>
              <div className="node" ref={n3Ref} style={{ left: 372, top: 44 }}>
                <div className="nh"><div className="nic" style={{ background: 'var(--gold)' }}>AI</div><div className="nt">AI Agent — ICP</div></div>
                <div className="nd">Score &amp; filter</div>
                <div className="ncount" ref={c3Ref}>0 qualified</div>
              </div>
              <div className="node" ref={n4Ref} style={{ left: 476, top: 114 }}>
                <div className="nh"><div className="nic" style={{ background: '#0f9d58' }}>G</div><div className="nt">Google Sheets</div></div>
                <div className="nd">Append rows</div>
              </div>
              <div className="node" ref={n5Ref} style={{ left: 140, top: 220 }}>
                <div className="nh"><div className="nic" style={{ background: '#ea4335' }}>✉</div><div className="nt">Send Cold Email</div></div>
                <div className="nd">Personalised outreach</div>
              </div>
            </div>
          </div>

          <div className="cv-foot">
            <span className="lf">Qualified leads today</span>
            <span className="lc" ref={leadcountRef}>0</span>
            <span className="log" ref={footlogRef}>▸ initialising…</span>
          </div>
        </div>
      </div>
      </div>

      <style jsx global>{`
        .kw24-ai-agents.sec { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 90px 56px; position: relative; overflow: hidden; --green: #00d26a; --node: #16161a; --node-b: #26262c; }
        .kw24-ai-agents .ai-inner { position: relative; z-index: 3; width: 100%; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 0.78fr 1.22fr; gap: 48px; align-items: center; }
        .kw24-ai-agents.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#141416 1px, transparent 1px), linear-gradient(90deg, #141416 1px, transparent 1px); background-size: 46px 46px; opacity: .5; -webkit-mask-image: radial-gradient(ellipse 90% 80% at 45% 50%, #000 35%, transparent 100%); mask-image: radial-gradient(ellipse 90% 80% at 45% 50%, #000 35%, transparent 100%); z-index: 0; }

        .kw24-ai-agents .left { position: relative; z-index: 3; }
        .kw24-ai-agents .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #222; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(255,255,255,.42); letter-spacing: .5px; margin-bottom: 26px; }
        .kw24-ai-agents .badge i { width: 6px; height: 6px; background: var(--gold); border-radius: 50%; animation: aiBlink 1.4s infinite; }
        @keyframes aiBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-ai-agents h2 { font-family: var(--display); font-size: clamp(32px,3.4vw,52px); font-weight: 800; line-height: 1.04; letter-spacing: -1.6px; margin-bottom: 20px; }
        .kw24-ai-agents h2 .g { color: var(--gold); }
        .kw24-ai-agents .sub { font-size: 16px; font-weight: 300; color: rgba(255,255,255,.42); line-height: 1.7; max-width: 400px; margin-bottom: 30px; }

        .kw24-ai-agents .agent-pills { display: flex; flex-direction: column; gap: 10px; margin-bottom: 32px; }
        .kw24-ai-agents .apill { display: flex; align-items: center; gap: 12px; border: 1px solid #1c1c20; background: #0b0b0d; border-radius: 8px; padding: 11px 14px; }
        .kw24-ai-agents .apill .ico { width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .kw24-ai-agents .apill .ico svg { width: 16px; height: 16px; stroke: #000; fill: none; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
        .kw24-ai-agents .apill .meta { flex: 1; }
        .kw24-ai-agents .apill .nm { font-size: 13px; font-weight: 600; color: #fff; }
        .kw24-ai-agents .apill .ts { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,.42); margin-top: 2px; }
        .kw24-ai-agents .apill .stat { font-family: var(--mono); font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 5px; }
        .kw24-ai-agents .apill .stat .d { width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: aiBlink 1.1s infinite; }

        .kw24-ai-agents .bp { display: inline-flex; align-items: center; gap: 9px; background: var(--gold); color: #000; font-family: var(--display); font-size: 13px; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; padding: 14px 26px; border-radius: 3px; text-decoration: none; transition: opacity .2s; }
        .kw24-ai-agents .bp:hover { opacity: .85; }

        .kw24-ai-agents .right { position: relative; z-index: 3; min-width: 0; }
        .kw24-ai-agents .canvas { background: #0a0a0c; border: 1px solid #1c1c20; border-radius: 12px; overflow: hidden; box-shadow: 0 40px 120px rgba(212,175,55,.08), 0 20px 60px rgba(0,0,0,.6); }
        .kw24-ai-agents .cv-bar { display: flex; align-items: center; gap: 10px; padding: 11px 16px; border-bottom: 1px solid #161619; background: #0d0d10; }
        .kw24-ai-agents .cv-title { font-family: var(--mono); font-size: 11px; color: #fff; display: flex; align-items: center; gap: 8px; }
        .kw24-ai-agents .cv-title .wf { width: 18px; height: 18px; border-radius: 5px; background: #ea4b71; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 700; font-size: 11px; font-family: var(--display); }
        .kw24-ai-agents .cv-tag { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,.42); }
        .kw24-ai-agents .cv-run { margin-left: auto; font-family: var(--mono); font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 6px; }
        .kw24-ai-agents .cv-run .d { width: 7px; height: 7px; border-radius: 50%; background: var(--green); animation: aiBlink 1.1s infinite; }

        .kw24-ai-agents .cv-body { position: relative; width: 100%; display: flex; justify-content: center; background-image: radial-gradient(circle, #1a1a1e 1px, transparent 1px); background-size: 22px 22px; overflow: hidden; }
        .kw24-ai-agents .stage { position: relative; width: 600px; height: 320px; flex-shrink: 0; transform-origin: top center; }
        .kw24-ai-agents svg.flow { position: absolute; inset: 0; width: 600px; height: 320px; }
        .kw24-ai-agents .conn { fill: none; stroke: #2a2a30; stroke-width: 2; }
        .kw24-ai-agents .packet { fill: var(--gold); filter: drop-shadow(0 0 5px var(--gold)); }

        .kw24-ai-agents .node { position: absolute; width: 124px; height: 70px; background: var(--node); border: 1px solid var(--node-b); border-radius: 9px; padding: 9px 11px; transition: border-color .3s, box-shadow .3s; opacity: 0; transform: translateY(10px); }
        .kw24-ai-agents .node.show { opacity: 1; transform: translateY(0); }
        .kw24-ai-agents .node.active { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold), 0 0 22px rgba(212,175,55,.18); }
        .kw24-ai-agents .node .nh { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; }
        .kw24-ai-agents .node .nic { width: 20px; height: 20px; border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: var(--display); font-weight: 800; font-size: 10px; color: #fff; }
        .kw24-ai-agents .node .nt { font-size: 10px; font-weight: 600; color: #fff; line-height: 1.1; }
        .kw24-ai-agents .node .nd { font-family: var(--mono); font-size: 8.5px; color: rgba(255,255,255,.42); line-height: 1.3; }
        .kw24-ai-agents .node .ncount { font-family: var(--mono); font-size: 9px; color: var(--gold); margin-top: 3px; font-weight: 500; }

        .kw24-ai-agents .cv-foot { display: flex; align-items: center; justify-content: space-between; padding: 11px 16px; border-top: 1px solid #161619; background: #0d0d10; }
        .kw24-ai-agents .cv-foot .lf { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,.42); }
        .kw24-ai-agents .cv-foot .lc { font-family: var(--display); font-size: 18px; font-weight: 800; color: var(--gold); }
        .kw24-ai-agents .cv-foot .log { font-family: var(--mono); font-size: 10px; color: var(--green); display: flex; align-items: center; gap: 6px; }

        .kw24-ai-agents .roasbadge { position: absolute; top: -50px; right: 24px; z-index: 6; background: #050506; border: 1px solid var(--gold); border-radius: 100px; padding: 8px 16px; display: flex; align-items: center; gap: 9px; box-shadow: 0 0 30px rgba(212,175,55,.3); }
        .kw24-ai-agents .roasbadge .lbl { font-size: 11px; color: rgba(255,255,255,.42); }
        .kw24-ai-agents .roasbadge .v { font-family: var(--display); font-size: 16px; font-weight: 800; color: var(--gold); }

        @media (max-width: 980px) {
          .kw24-ai-agents.sec { padding: 70px 22px; }
          .kw24-ai-agents .ai-inner { grid-template-columns: 1fr; }
          .kw24-ai-agents .right { display: flex; flex-direction: column; }
          .kw24-ai-agents .roasbadge { position: static; align-self: flex-start; margin-bottom: 14px; }
          .kw24-ai-agents .cv-tag { display: none; }
        }
      `}</style>
    </section>
  )
}
