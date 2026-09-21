# Knowledge World24

Marketing site for Knowledge World24 — an AI-first digital marketing agency — built with Next.js.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. Pages auto-update as you edit files under `app/`.

## Environment variables

Set these in `.env.local` for local development (and in your hosting provider's dashboard for production):

- `RESEND_API_KEY` — used by the contact form (`app/api/contact/route.ts`) and free audit form (`app/api/free-audit/route.ts`) to send email via [Resend](https://resend.com).
- `PAGESPEED_API_KEY` — a Google Cloud API key with the PageSpeed Insights API enabled, used by `app/api/pagespeed/route.ts` to power the automated report shown after someone submits the free audit form.

## Blog

Blog posts are plain Markdown files with frontmatter under `content/blog/`. To publish a new post, add a `.md` file there (see existing posts for the expected frontmatter fields) and deploy — no CMS or database involved.

## Deployment

Deployed via Vercel, connected to this repository's `main` branch.
