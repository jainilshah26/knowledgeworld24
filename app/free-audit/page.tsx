import type { Metadata } from 'next'
import FreeAuditForm from './FreeAuditForm'

export const metadata: Metadata = {
  title: 'Free Audit',
  description: 'Get a free SEO, ads, and automation audit for your business from Knowledge World24.',
  alternates: {
    canonical: '/free-audit',
  },
}

export default function FreeAuditPage() {
  return <FreeAuditForm />
}
