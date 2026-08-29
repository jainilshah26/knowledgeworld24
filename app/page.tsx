import Navbar    from '@/app/components/Navbar'
import Hero      from '@/app/components/Hero'
import Services  from '@/app/components/Services'
import MetaAds   from '@/app/components/MetaAds'
import AiAgents  from '@/app/components/AiAgents'
import Contact   from '@/app/components/Contact'
import Footer    from '@/app/components/Footer'

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <Services />
      <MetaAds />
      <AiAgents />
      <Contact />
      <Footer />
    </main>
  )
}
