import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import readingTime from 'reading-time'

const POSTS_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  category: string
  author: string
  readTime: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

function getSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''))
}

function readPostFile(slug: string) {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`)
  const raw = fs.readFileSync(fullPath, 'utf8')
  return matter(raw)
}

export function getAllPosts(): PostMeta[] {
  const posts = getSlugs().map(slug => {
    const { data, content } = readPostFile(slug)
    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
      category: data.category as string,
      author: (data.author as string) || 'Jainil Shah',
      readTime: readingTime(content).text,
    }
  })
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const { data, content } = readPostFile(slug)
  const processed = await remark().use(html).process(content)

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    author: (data.author as string) || 'Jainil Shah',
    readTime: readingTime(content).text,
    contentHtml: processed.toString(),
  }
}

export function getAllSlugs(): string[] {
  return getSlugs()
}
