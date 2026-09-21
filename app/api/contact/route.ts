import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getClientIp, isRateLimited } from '@/lib/rateLimit'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_SHORT = 200
const MAX_LONG = 5000

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  const ip = getClientIp(request)
  if (isRateLimited(`contact:${ip}`)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  const body = await request.json()
  const { name, email, company, message, website } = body

  // Honeypot: a hidden field real visitors never fill in. If it's set,
  // silently pretend success so the bot doesn't learn to adapt.
  if (typeof website === 'string' && website.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
  }

  if (
    typeof name !== 'string' || typeof email !== 'string' ||
    (company !== undefined && typeof company !== 'string') ||
    (message !== undefined && typeof message !== 'string')
  ) {
    return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 })
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (
    name.length > MAX_SHORT || email.length > MAX_SHORT ||
    (company && company.length > MAX_SHORT) ||
    (message && message.length > MAX_LONG)
  ) {
    return NextResponse.json({ error: 'One of the fields is too long.' }, { status: 400 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: 'Knowledge World24 <noreply@knowledgeworld24.com>',
      to: 'jainilshah345@gmail.com',
      replyTo: email,
      subject: `New enquiry from ${name}${company ? ` (${company})` : ''}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company / Brand:</strong> ${escapeHtml(company || '—')}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message || '').replace(/\n/g, '<br/>')}</p>
      `,
    })

    if (error) {
      console.error('Resend error (contact):', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    // Best-effort confirmation to the submitter — the lead is already
    // captured above, so a failure here shouldn't fail the request.
    const { error: confirmError } = await resend.emails.send({
      from: 'Knowledge World24 <noreply@knowledgeworld24.com>',
      to: email,
      replyTo: 'jainilshah345@gmail.com',
      subject: `We've received your message, ${name.split(' ')[0]}`,
      html: `
        <h2>Thanks for reaching out, ${escapeHtml(name.split(' ')[0])}!</h2>
        <p>We've received your message and our team will get back to you within 24 hours.</p>
        <p>— The Knowledge World24 Team</p>
      `,
    })
    if (confirmError) {
      console.error('Resend confirmation error (contact):', confirmError)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact submission failed:', err)
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
