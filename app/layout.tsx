import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono, Arimo } from 'next/font/google'
import './globals.css'
import StyledJsxRegistry from './registry'

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const arimo = Arimo({
  variable: '--font-arimo',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Knowledge World 24 — AI-First Digital Marketing Agency',
  description:
    'We build marketing that thinks. AI-first digital marketing agency in Ahmedabad crafting campaigns that adapt, learn, and deliver 5x ROI.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${arimo.variable}`}>
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
