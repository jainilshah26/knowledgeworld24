#!/usr/bin/env node
// Notifies Bing, Yandex, and other IndexNow-participating search engines
// immediately when a page is published or updated, instead of waiting for
// their next scheduled crawl. Google does not support IndexNow — there is
// no public API for requesting Google indexing of a normal page; use
// Search Console's URL Inspection → "Request Indexing" for that.
//
// Usage:
//   node scripts/indexnow.mjs                 # submit every URL in the sitemap
//   node scripts/indexnow.mjs /blog/some-post  # submit specific path(s) only

const SITE_URL = 'https://knowledgeworld24.com'
const KEY = '7cf0c8382417432136de0f6ced91bd3f'
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`

async function getSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`)
  const xml = await res.text()
  return Array.from(xml.matchAll(/<loc>(.*?)<\/loc>/g)).map(m => m[1])
}

async function main() {
  const args = process.argv.slice(2)
  const urlList = args.length > 0
    ? args.map(p => (p.startsWith('http') ? p : `${SITE_URL}${p}`))
    : await getSitemapUrls()

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`)

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE_URL).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  })

  console.log(`IndexNow responded with status ${res.status}`)
  if (!res.ok) {
    console.log(await res.text())
    process.exitCode = 1
  }
}

main()
