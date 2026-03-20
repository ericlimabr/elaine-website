import nodemailer from "nodemailer"
import { escapeHtml } from "@/utils/strings"

// We created the carrier using simple SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Ex: smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // Ex: 465 (SSL) ou 587 (TLS)
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER, // The email you will send (ex: contato@psicologaelainebarbosa.com.br)
    pass: process.env.SMTP_PASS, // Email password or App password
  },
})

interface EmailPayload {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactNotificationEmail({
  name,
  email,
  subject,
  message,
}: EmailPayload) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeSubject = escapeHtml(subject)
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br>")

  try {
    await transporter.sendMail({
      from: `"${safeName}" <${process.env.SMTP_USER}>`, // The "from" official must be your email to avoid SPAM
      replyTo: email, // When Elaine clicks "Reply", it goes to the client's email
      to: process.env.CONTACT_EMAIL_DESTINATION,
      subject: `[Portal] Nova Mensagem: ${safeSubject}`,
      text: `Nome: ${name}\nE-mail: ${email}\nAssunto: ${subject}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Nova mensagem de contato</h2>
          <p><strong>Remetente:</strong> ${safeName}</p>
          <p><strong>E-mail:</strong> ${safeEmail}</p>
          <p><strong>Assunto:</strong> ${safeSubject}</p>
          <div style="margin-top: 20px; padding: 15px; bg-color: #f9f9f9; border-left: 4px solid #4f46e5;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error("Erro no SMTP Nodemailer:", error)
    return { success: false }
  }
}
