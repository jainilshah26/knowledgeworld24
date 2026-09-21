import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import ReportClient from './ReportClient'

export const metadata: Metadata = {
  title: 'Your Audit Report',
  robots: {
    index: false,
    follow: true,
  },
}

export default function FreeAuditReportPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Suspense fallback={null}>
        <ReportClient />
      </Suspense>
      <Footer />
    </main>
  )
}
