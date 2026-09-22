import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Fraunces, Manrope, JetBrains_Mono, Arimo } from 'next/font/google'
import './globals.css'
import StyledJsxRegistry from './registry'

const GA_MEASUREMENT_ID = 'G-00HBKQRYK5'

const SITE_URL = 'https://knowledgeworld24.com'
const SITE_NAME = 'Knowledge World24'
const SITE_TITLE = 'Knowledge World24 — AI-First Digital Marketing Agency in Ahmedabad'
const SITE_DESCRIPTION =
  'AI-first digital marketing agency in Ahmedabad crafting SEO, AI automation, and performance marketing campaigns that adapt, learn, and deliver 5x ROI.'

const fraunces = Fraunces({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: '%s | Knowledge World24',
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'digital marketing agency Ahmedabad',
    'AI marketing agency India',
    'SEO agency Ahmedabad',
    'AI automation agency',
    'performance marketing agency',
    'Knowledge World24',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'Marketing',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f7f3ea',
  colorScheme: 'light',
}

const SITE_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Gandhinagar',
  addressRegion: 'Gujarat',
  addressCountry: 'IN',
  // TODO: add streetAddress / postalCode once confirmed
  streetAddress: 'GIFT City',
}

// LocalBusiness already extends Organization in schema.org, so the company
// is one entity typed as both — not two near-duplicate nodes with the same
// name/url, which validators' entity resolution tends to collapse into one.
const organizationJsonLd = {
  '@type': ['Organization', 'LocalBusiness'],
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/logo.png`,
  description: SITE_DESCRIPTION,
  email: 'hello@knowledgeworld24.com',
  address: SITE_ADDRESS,
  areaServed: 'IN',
  sameAs: [
    // TODO: add real social profile URLs (LinkedIn, Instagram, X, YouTube)
  ],
}

const websiteJsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { '@id': `${SITE_URL}/#organization` },
  inLanguage: 'en-IN',
}

// Combined into a single @graph so every validator resolves the @id
// cross-reference (publisher) between these entities instead of treating
// each as an isolated, unrelated document.
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [organizationJsonLd, websiteJsonLd],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${jetbrainsMono.variable} ${arimo.variable}`}>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  )
}
