'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

const GREETING: Message = {
  role: 'assistant',
  text: "Hi! I'm the Knowledge World24 assistant. Ask me about our SEO, AI automation, or ad services — or I can point you to a free audit.",
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const history = [...messages, { role: 'user' as const, text }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        setMessages(m => [...m, { role: 'assistant', text: data?.error || "Sorry, I couldn't respond right now." }])
        return
      }

      setMessages(m => [...m, { role: 'assistant', text: data.text }])
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: "Sorry, I couldn't respond right now. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="kw24-chat">
      {open && (
        <div className="panel">
          <div className="head">
            <div className="title">
              <span className="dot" />
              Knowledge World24
            </div>
            <button type="button" className="close" onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="body" ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role}`}>{m.text}</div>
            ))}
            {loading && <div className="bubble assistant typing">…</div>}
          </div>

          <div className="composer">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question…"
              rows={1}
              disabled={loading}
            />
            <button type="button" onClick={send} disabled={loading || !input.trim()} aria-label="Send">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      )}

      <button type="button" className="bubble-btn" onClick={() => setOpen(o => !o)} aria-label={open ? 'Close chat' : 'Open chat'}>
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
        )}
      </button>

      <style jsx global>{`
        .kw24-chat { position: fixed; right: 22px; bottom: 22px; z-index: 500; }
        .kw24-chat .bubble-btn { width: 56px; height: 56px; border-radius: 50%; border: none; background: linear-gradient(135deg,#e6c876,var(--accent) 60%,#8a6a1e); color: #1a1712; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 6px 24px rgba(26,23,18,.22); transition: box-shadow .3s, transform .2s; }
        .kw24-chat .bubble-btn:hover { box-shadow: 0 8px 32px rgba(184,145,43,.45); transform: translateY(-1px); }

        .kw24-chat .panel { position: absolute; right: 0; bottom: 72px; width: min(360px, calc(100vw - 44px)); height: min(520px, calc(100vh - 140px)); background: #fff; border: 1px solid #e4dcc8; border-radius: 16px; box-shadow: 0 16px 50px rgba(26,23,18,.18); display: flex; flex-direction: column; overflow: hidden; animation: kw24ChatIn .25s ease; }
        @keyframes kw24ChatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .kw24-chat .head { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #e4dcc8; background: var(--bg); }
        .kw24-chat .title { display: flex; align-items: center; gap: 8px; font-family: var(--display); font-weight: 700; font-size: 14px; color: #1a1712; }
        .kw24-chat .dot { width: 7px; height: 7px; border-radius: 50%; background: #2e9e5b; }
        .kw24-chat .close { background: none; border: none; color: rgba(26,23,18,.45); cursor: pointer; font-size: 14px; padding: 4px; }
        .kw24-chat .close:hover { color: #1a1712; }

        .kw24-chat .body { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .kw24-chat .bubble { max-width: 84%; padding: 10px 13px; border-radius: 12px; font-size: 13.5px; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
        .kw24-chat .bubble.assistant { align-self: flex-start; background: var(--bg); color: #1a1712; border: 1px solid #e4dcc8; border-bottom-left-radius: 3px; }
        .kw24-chat .bubble.user { align-self: flex-end; background: var(--accent); color: #1a1712; border-bottom-right-radius: 3px; }

        .kw24-chat .composer { display: flex; align-items: flex-end; gap: 8px; padding: 12px; border-top: 1px solid #e4dcc8; }
        .kw24-chat .composer textarea { flex: 1; resize: none; max-height: 90px; border: 1px solid #e4dcc8; border-radius: 10px; padding: 9px 12px; font-size: 13.5px; font-family: inherit; outline: none; transition: border-color .2s; }
        .kw24-chat .composer textarea:focus { border-color: rgba(184,145,43,.5); }
        .kw24-chat .composer button { flex-shrink: 0; width: 36px; height: 36px; border-radius: 10px; border: none; background: var(--accent); color: #1a1712; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity .2s; }
        .kw24-chat .composer button:disabled { opacity: .4; cursor: not-allowed; }

        @media (max-width: 480px) {
          .kw24-chat { right: 16px; bottom: 16px; }
          .kw24-chat .panel { bottom: 68px; }
        }
      `}</style>
    </div>
  )
}
