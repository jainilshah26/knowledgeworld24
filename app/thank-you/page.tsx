import type { Metadata } from 'next'
import ThankYouContent from './ThankYouContent'

export const metadata: Metadata = {
  title: 'Thank You',
  description: 'Thanks for reaching out to Knowledge World24. Our team will get back to you within 24 hours.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/thank-you',
  },
}

export default function ThankYouPage() {
  return <ThankYouContent />
}
