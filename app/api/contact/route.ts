import { NextResponse } from 'next/server'
import { Resend } from 'resend'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: Request) {
  const { name, email, company, message } = await request.json()

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
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
