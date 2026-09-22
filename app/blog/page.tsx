import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Insights on SEO, performance marketing, and AI automation from the Knowledge World24 team.',
  alternates: {
    canonical: '/blog',
  },
}

const SITE_URL = 'https://knowledgeworld24.com'

export default function BlogPage() {
  const posts = getAllPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Knowledge World24 Blog',
    url: `${SITE_URL}/blog`,
    description: 'Insights on SEO, performance marketing, and AI automation from the Knowledge World24 team.',
    publisher: { '@id': `${SITE_URL}/#organization` },
    blogPost: posts.map(post => ({
      '@type': 'BlogPosting',
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      datePublished: post.date,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
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
      <section className="kw24-blog sec">
        <div className="head">
          <div className="badge"><i></i> Blog</div>
          <h1>Insights on <span className="g">SEO, Ads &amp; AI Automation.</span></h1>
          <p className="sub">Practical thinking on what actually moves the needle — no fluff, no recycled listicles.</p>
        </div>

        <div className="grid">
          {posts.length === 0 && <p className="empty">No posts yet — check back soon.</p>}
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
              <div className="cat">{post.category}</div>
              <h2>{post.title}</h2>
              <p className="excerpt">{post.excerpt}</p>
              <div className="meta">
                <span>{new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="dot">·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />

      <style>{`
        .kw24-blog.sec { position: relative; padding: 140px 56px 100px; overflow: hidden; }
        .kw24-blog.sec::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(#e8e2d2 1px, transparent 1px), linear-gradient(90deg, #e8e2d2 1px, transparent 1px); background-size: 46px 46px; opacity: .4; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, #000 30%, transparent 100%); z-index: 0; }

        .kw24-blog .head { position: relative; z-index: 2; max-width: 720px; margin: 0 auto 64px; text-align: center; }
        .kw24-blog .badge { display: inline-flex; align-items: center; gap: 8px; border: 1px solid #e4dcc8; padding: 6px 14px; border-radius: 100px; font-size: 11px; color: rgba(26,23,18,.45); letter-spacing: .5px; margin-bottom: 22px; }
        .kw24-blog .badge i { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: blogBlink 1.4s infinite; }
        @keyframes blogBlink { 0%, 100% { opacity: 1; } 50% { opacity: .2; } }
        .kw24-blog h1 { font-family: var(--display); font-size: clamp(32px,4.5vw,54px); font-weight: 800; letter-spacing: -1.5px; line-height: 1.08; margin-bottom: 16px; }
        .kw24-blog h1 .g { color: var(--accent); }
        .kw24-blog .sub { font-size: 16px; font-weight: 300; color: rgba(26,23,18,.5); line-height: 1.7; }

        .kw24-blog .grid { position: relative; z-index: 2; max-width: 1180px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .kw24-blog .empty { grid-column: 1 / -1; text-align: center; color: rgba(26,23,18,.4); font-size: 14px; }
        .kw24-blog .card { display: flex; flex-direction: column; background: #fff; border: 1px solid #e4dcc8; border-radius: 16px; padding: 28px; text-decoration: none; transition: border-color .25s, transform .25s; }
        .kw24-blog .card:hover { border-color: rgba(184,145,43,.5); transform: translateY(-3px); }
        .kw24-blog .cat { display: inline-flex; align-self: flex-start; font-family: var(--mono); font-size: 10px; letter-spacing: .5px; text-transform: uppercase; color: var(--accent); background: rgba(184,145,43,.1); border-radius: 100px; padding: 5px 12px; margin-bottom: 16px; }
        .kw24-blog .card h2 { font-family: var(--display); font-size: 19px; font-weight: 700; letter-spacing: -.2px; line-height: 1.3; color: #1a1712; margin-bottom: 10px; }
        .kw24-blog .excerpt { font-size: 13.5px; color: rgba(26,23,18,.55); line-height: 1.7; font-weight: 300; margin-bottom: 20px; flex: 1; }
        .kw24-blog .meta { font-family: var(--mono); font-size: 11px; color: rgba(26,23,18,.4); display: flex; align-items: center; gap: 8px; padding-top: 16px; border-top: 1px solid #e4dcc8; }
        .kw24-blog .dot { opacity: .5; }

        @media (max-width: 980px) {
          .kw24-blog .grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .kw24-blog.sec { padding: 110px 22px 70px; }
          .kw24-blog .grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  )
}

