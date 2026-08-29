# Knowledge World24

Marketing site for Knowledge World24 — an AI-first digital marketing agency — built with Next.js.

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it. Pages auto-update as you edit files under `app/`.

## Contact form

The contact form (`app/api/contact/route.ts`) sends email via [Resend](https://resend.com). Set `RESEND_API_KEY` in `.env.local` for it to work locally.

## Deployment

Deployed via AWS Amplify Hosting, connected to this repository's `main` branch.
