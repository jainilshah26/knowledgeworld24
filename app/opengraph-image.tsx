import { ImageResponse } from 'next/og'

export const alt = 'Knowledge World24 — AI-First Digital Marketing Agency'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f7f3ea',
          backgroundImage:
            'radial-gradient(ellipse 60% 60% at 50% 40%, rgba(184,145,43,0.18) 0%, transparent 70%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 34,
            color: 'rgba(26,23,18,0.55)',
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 28,
          }}
        >
          Knowledge<span style={{ color: '#b8912b' }}>World24</span>
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 800,
            color: '#1a1712',
            textAlign: 'center',
            maxWidth: 980,
            lineHeight: 1.15,
          }}
        >
          From Page 2 to <span style={{ color: '#b8912b', marginLeft: 18 }}>Rank #1.</span>
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 28,
            color: 'rgba(26,23,18,0.45)',
          }}
        >
          AI-First Digital Marketing Agency — Ahmedabad
        </div>
      </div>
    ),
    { ...size }
  )
}
