'use client'

/*
 * Magnetic-hover behaviour for [data-magnet] elements (including this
 * component's "Free Audit" button) and the custom cursor scaling on
 * hover are wired up centrally in Hero.tsx via a document-wide query,
 * mirroring the single shared <script> in the original reference markup.
 */

import { useState } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="kw24-nav">
      <a href="/" className="logo">
        <Image src="/logo.png" alt="Knowledge World24" width={34} height={34} priority />
        Knowledge<span>World24</span>
      </a>
      <ul className="nav-links">
        <li><a href="#services">Services</a></li>
        <li><a href="#ai-automation">AI Automation</a></li>
        <li><a href="#performance-marketing">Ads</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <a href="#contact" className="nav-btn" data-magnet>Free Audit</a>

      <button
        type="button"
        className={`burger${open ? ' open' : ''}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        <span></span><span></span><span></span>
      </button>

      <div className={`overlay${open ? ' open' : ''}`} onClick={() => setOpen(false)} />
      <div className={`mobile-menu${open ? ' open' : ''}`}>
        <a href="#services" onClick={() => setOpen(false)}>Services</a>
        <a href="#ai-automation" onClick={() => setOpen(false)}>AI Automation</a>
        <a href="#performance-marketing" onClick={() => setOpen(false)}>Ads</a>
        <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
        <a href="#contact" className="nav-btn" onClick={() => setOpen(false)}>Free Audit</a>
      </div>

      <style jsx>{`
        .kw24-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 56px;
          border-bottom: 1px solid #101512;
          background: rgba(5, 5, 6, .5);
          backdrop-filter: blur(12px);
          transform: translateY(-100%);
          animation: navIn .8s var(--ease) .1s forwards;
        }
        @keyframes navIn { to { transform: translateY(0); } }
        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--display);
          font-weight: 800;
          font-size: 16px;
          letter-spacing: -.3px;
          white-space: nowrap;
          text-decoration: none;
          color: #fff;
        }
        .logo :global(img) {
          border-radius: 50%;
        }
        .logo span { color: var(--accent); }
        .nav-links {
          display: flex;
          gap: 32px;
          list-style: none;
        }
        .nav-links a {
          font-size: 13px;
          color: rgba(255, 255, 255, .42);
          text-decoration: none;
          transition: color .2s;
          position: relative;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0;
          height: 1px;
          background: var(--accent);
          transition: width .3s var(--ease);
        }
        .nav-links a:hover { color: #fff; }
        .nav-links a:hover::after { width: 100%; }
        .nav-btn {
          font-family: var(--display);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #000;
          background: var(--accent);
          padding: 10px 20px;
          border-radius: 3px;
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          will-change: transform;
        }
        .burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 34px;
          height: 34px;
          border: 1px solid #222;
          border-radius: 6px;
          background: rgba(11,11,13,.6);
          cursor: pointer;
          flex-shrink: 0;
        }
        .burger span {
          display: block;
          width: 16px;
          height: 1.5px;
          background: #fff;
          transition: transform .3s var(--ease), opacity .3s var(--ease);
        }
        .burger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .burger.open span:nth-child(2) { opacity: 0; }
        .burger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.5);
          opacity: 0;
          pointer-events: none;
          transition: opacity .3s var(--ease);
          z-index: 98;
        }
        .overlay.open { opacity: 1; pointer-events: auto; }

        .mobile-menu {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: min(78vw, 320px);
          background: #08080a;
          border-left: 1px solid #17211c;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 90px 28px 40px;
          transform: translateX(100%);
          transition: transform .4s var(--ease);
          z-index: 99;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-menu a {
          font-size: 15px;
          color: rgba(255,255,255,.7);
          text-decoration: none;
          padding: 14px 0;
          border-bottom: 1px solid #121a15;
          transition: color .2s;
        }
        .mobile-menu a:hover { color: var(--accent); }
        .mobile-menu a.nav-btn {
          margin-top: 20px;
          text-align: center;
          border-bottom: none;
          color: #000;
        }

        @media (max-width: 980px) {
          .kw24-nav { padding: 16px 22px; }
          .nav-links { display: none; }
          .nav-btn { display: none; }
          .burger { display: flex; }
        }
        @media (max-width: 400px) {
          .logo { font-size: 14px; }
        }
      `}</style>
    </nav>
  )
}
