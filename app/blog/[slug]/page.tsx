import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { getAllSlugs, getPostBySlug } from '@/lib/posts'

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  }
}

const SITE_URL = 'https://knowledgeworld24.com'

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const postUrl = `${SITE_URL}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Article', 'BlogPosting'],
    '@id': `${postUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/logo.png`,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@id': `${SITE_URL}/#organization` },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    articleSection: post.category,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    url: postUrl,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
    ],
  }

  return (
    <main className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navbar />
      <article className="kw24-post sec">
        <div className="wrap">
          <Link href="/blog" className="back">← Back to Blog</Link>
          <div className="cat">{post.category}</div>
          <h1>{post.title}</h1>
          <div className="meta">
            <span>{post.author}</span>
            <span className="dot">·</span>
            <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className="dot">·</span>
            <span>{post.readTime}</span>
          </div>

          <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
      </article>
      <Footer />

      <style>{`
        .kw24-post.sec { position: relative; padding: 140px 56px 100px; overflow: hidden; }
        .kw24-post.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 70% 50% at 50% 0%, #000 30%, transparent 100%); z-index: 0; }

        .kw24-post .wrap { position: relative; z-index: 2; max-width: 720px; margin: 0 auto; }
        .kw24-post .back { display: block; font-size: 13px; color: rgba(26,23,18,.45); text-decoration: none; margin-bottom: 20px; transition: color .2s; }
        .kw24-post .back:hover { color: var(--accent); }
        .kw24-post .cat { display: inline-flex; font-family: var(--mono); font-size: 10px; letter-spacing: .5px; text-transform: uppercase; color: var(--accent); background: rgba(184,145,43,.1); border-radius: 100px; padding: 5px 12px; margin-bottom: 18px; }
        .kw24-post h1 { font-family: var(--display); font-size: clamp(28px,4.5vw,46px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.15; margin-bottom: 18px; }
        .kw24-post .meta { font-family: var(--mono); font-size: 12px; color: rgba(26,23,18,.45); display: flex; align-items: center; gap: 8px; margin-bottom: 44px; padding-bottom: 32px; border-bottom: 1px solid #e4dcc8; }
        .kw24-post .dot { opacity: .5; }

        .kw24-post .prose { font-size: 16.5px; line-height: 1.85; color: rgba(26,23,18,.85); font-weight: 300; }
        .kw24-post .prose h2 { font-family: var(--display); font-size: 26px; font-weight: 700; letter-spacing: -.4px; color: #1a1712; margin: 44px 0 16px; }
        .kw24-post .prose h3 { font-family: var(--display); font-size: 20px; font-weight: 700; color: #1a1712; margin: 32px 0 12px; }
        .kw24-post .prose p { margin-bottom: 20px; }
        .kw24-post .prose ul, .kw24-post .prose ol { margin: 0 0 20px 22px; }
        .kw24-post .prose li { margin-bottom: 8px; }
        .kw24-post .prose a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .kw24-post .prose strong { color: #1a1712; font-weight: 600; }
        .kw24-post .prose hr { border: none; border-top: 1px solid #e4dcc8; margin: 40px 0; }
        .kw24-post .prose table { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14.5px; }
        .kw24-post .prose th, .kw24-post .prose td { text-align: left; padding: 10px 14px; border: 1px solid #e4dcc8; }
        .kw24-post .prose th { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: .3px; background: #faf7ef; }

        @media (max-width: 640px) {
          .kw24-post.sec { padding: 110px 22px 70px; }
          .kw24-post .prose { font-size: 15.5px; }
        }
      `}</style>
    </main>
  )
}
