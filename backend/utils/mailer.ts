import nodemailer from 'nodemailer'
import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '../config/env'

const transporter = SMTP_HOST
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
    })
  : null

interface SendEmailInput {
  to: string
  subject: string
  text: string
}

export const sendEmail = async (input: SendEmailInput): Promise<void> => {
  if (!transporter) {
    console.error('SMTP not configured — skipping email send', { to: input.to, subject: input.subject })
    return
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: input.to, subject: input.subject, text: input.text })
  } catch (error) {
    console.error('Failed to send email', error)
  }
}
