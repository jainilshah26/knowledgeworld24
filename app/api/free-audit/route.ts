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
  const { name, email, businessName, businessUrl, description } = await request.json()

  if (!name || !email || !businessName || !businessUrl) {
    return NextResponse.json(
      { error: 'Name, email, business name, and business URL are required.' },
      { status: 400 }
    )
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: 'Knowledge World24 <onboarding@resend.dev>',
      to: 'hello@knowledgeworld24.com',
      replyTo: email,
      subject: `New free audit request from ${name} (${businessName})`,
      html: `
        <h2>New free audit request</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Business Name:</strong> ${escapeHtml(businessName)}</p>
        <p><strong>Business URL:</strong> ${escapeHtml(businessUrl)}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(description || '—').replace(/\n/g, '<br/>')}</p>
      `,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }
}
