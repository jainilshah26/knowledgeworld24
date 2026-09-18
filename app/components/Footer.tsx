'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="kw24-footer">
      <div className="top">
        <div className="brand">
          <div className="logo">
            <Image src="/logo.png" alt="Knowledge World24" width={30} height={30} />
            Knowledge<span>World24</span>
          </div>
          <p>An AI-first digital marketing agency in Ahmedabad, deploying agents that run SEO, ads, and content 24/7 — so you scale while you sleep.</p>
          {/* TODO: swap in real social profile URLs */}
          <div className="socials">
            <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg></a>
            <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></a>
            <a href="#" aria-label="X"><svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20" /></svg></a>
            <a href="#" aria-label="YouTube"><svg viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="4" /><polygon points="10,9 16,12 10,15" /></svg></a>
          </div>
        </div>

        <div className="col">
          <h4>Services</h4>
          <ul>
            <li><a href="#services">SEO &amp; AI Search</a></li>
            <li><a href="#ai-automation">AI Automation</a></li>
            <li><a href="#performance-marketing">Performance Marketing</a></li>
            <li><a href="#services">Social Media</a></li>
            <li><a href="#services">Content Marketing</a></li>
            <li><a href="#services">Video Production</a></li>
          </ul>
        </div>

        <div className="col">
          <h4>Company</h4>
          <ul>
            {/* TODO: point these at real /about, /work, /careers routes once built */}
            <li><a href="#">About Us</a></li>
            <li><a href="#">Our Work</a></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div className="newsletter">
          <h4 className="newsletter-h4">Stay Updated</h4>
          <p>Marketing &amp; automation insights, twice a week. No spam.</p>
          <form className="nform" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Your email" />
            <button type="submit">→</button>
          </form>
        </div>
      </div>

      <div className="bottom">
        <div className="copy">© 2025 Knowledge World24. All rights reserved. GIFT City, Gandhinagar.</div>
        <div className="legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      <style jsx global>{`
        .kw24-footer { position: relative; border-top: 1px solid #e4dcc8; padding: 64px 56px 28px; overflow: hidden; --muted2: rgba(26,23,18,.22); }
        .kw24-footer::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e4dcc8 1px, transparent 1px), linear-gradient(90deg, #e4dcc8 1px, transparent 1px); background-size: 46px 46px; opacity: .25; -webkit-mask-image: radial-gradient(ellipse 70% 100% at 0% 0%, #000 0%, transparent 70%); mask-image: radial-gradient(ellipse 70% 100% at 0% 0%, #000 0%, transparent 70%); }

        .kw24-footer .top { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.1fr; gap: 40px; padding-bottom: 48px; border-bottom: 1px solid #e4dcc8; }

        .kw24-footer .brand .logo { display: flex; align-items: center; gap: 10px; font-family: var(--display); font-weight: 800; font-size: 18px; letter-spacing: -.3px; margin-bottom: 14px; }
        .kw24-footer .brand .logo :global(img) { border-radius: 50%; }
        .kw24-footer .brand .logo span { color: var(--accent); }
        .kw24-footer .brand p { font-size: 13.5px; color: rgba(26,23,18,.4); line-height: 1.7; max-width: 260px; margin-bottom: 20px; font-weight: 300; }
        .kw24-footer .socials { display: flex; gap: 10px; }
        .kw24-footer .socials a { width: 34px; height: 34px; border: 1px solid #e4dcc8; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all .25s; }
        .kw24-footer .socials a:hover { border-color: var(--accent); background: rgba(184,145,43,.08); }
        .kw24-footer .socials svg { width: 15px; height: 15px; stroke: rgba(26,23,18,.4); fill: none; stroke-width: 1.6; transition: stroke .25s; }
        .kw24-footer .socials a:hover svg { stroke: var(--accent); }

        .kw24-footer .col h4, .kw24-footer .newsletter-h4 { font-family: var(--mono); font-size: 11px; color: rgba(26,23,18,.4); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 18px; }
        .kw24-footer .col ul { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .kw24-footer .col a { font-size: 13.5px; color: rgba(26,23,18,.7); text-decoration: none; transition: color .2s; position: relative; width: fit-content; }
        .kw24-footer .col a::after { content: ''; position: absolute; left: 0; bottom: -3px; width: 0; height: 1px; background: var(--accent); transition: width .3s; }
        .kw24-footer .col a:hover { color: #1a1712; }
        .kw24-footer .col a:hover::after { width: 100%; }

        .kw24-footer .newsletter p { font-size: 13px; color: rgba(26,23,18,.4); line-height: 1.6; margin-bottom: 14px; font-weight: 300; }
        .kw24-footer .nform { display: flex; gap: 8px; }
        .kw24-footer .nform input { flex: 1; background: #ffffff; border: 1px solid #e4dcc8; color: #1a1712; font-size: 13px; padding: 11px 14px; border-radius: 6px; outline: none; transition: border-color .25s; }
        .kw24-footer .nform input:focus { border-color: rgba(184,145,43,.5); }
        .kw24-footer .nform button { background: var(--accent); color: #000; border: none; border-radius: 6px; padding: 0 16px; font-family: var(--display); font-weight: 700; font-size: 16px; cursor: pointer; transition: opacity .2s; }
        .kw24-footer .nform button:hover { opacity: .85; }

        .kw24-footer .bottom { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; padding-top: 24px; flex-wrap: wrap; gap: 12px; }
        .kw24-footer .copy { font-size: 12px; color: var(--muted2); }
        .kw24-footer .legal { display: flex; gap: 24px; }
        .kw24-footer .legal a { font-size: 12px; color: var(--muted2); text-decoration: none; transition: color .2s; }
        .kw24-footer .legal a:hover { color: rgba(26,23,18,.4); }

        @media (max-width: 900px) {
          .kw24-footer .top { grid-template-columns: 1fr 1fr; gap: 32px 24px; }
          .kw24-footer { padding: 56px 24px 24px; }
          .kw24-footer .bottom { flex-direction: column; align-items: flex-start; }
        }
        @media (max-width: 560px) {
          .kw24-footer .top { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}
