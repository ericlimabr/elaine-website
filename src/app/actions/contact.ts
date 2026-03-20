"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { sanitizeEmail } from "@/utils/strings"
import { sendContactNotificationEmail } from "@/lib/mail"
import { getUser } from "@/utils/getUser"

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

async function isRateLimited(email: string): Promise<boolean> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS)
  const count = await prisma.contactMessage.count({
    where: { email, createdAt: { gte: since } },
  })
  return count >= RATE_LIMIT_MAX
}

export async function submitContactForm(formData: FormData) {
  // HONEYPOT CHECK - If this field is filled, it's a bot.
  const botTrap = formData.get("website")
  if (botTrap) {
    // We return "success" to trick the bot, but we don't actually do anything.
    return { success: true, message: "Bot detected and ignored." }
  }

  const name = formData.get("name") as string
  const email = sanitizeEmail(formData.get("email") as string)
  const subject = formData.get("subject") as string
  const message = formData.get("message") as string

  if (!name || !email || !message) {
    return { success: false, error: "Campos obrigatórios ausentes." }
  }

  // RATE LIMIT CHECK — database-backed, persists across serverless instances
  if (await isRateLimited(email)) {
    return {
      success: false,
      error: "Muitas tentativas. Tente novamente em 1 hora.",
    }
  }

  try {
    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    })

    // TODO: Here you can send an email using Resend or Nodemailer in the future
    await sendContactNotificationEmail({ name, email, subject, message })

    return { success: true }
  } catch (error) {
    console.error("Contact Form Error:", error)
    return { success: false, error: "Erro ao processar sua mensagem." }
  }
}

export async function countUnreadMessages(id?: string) {
  if (!(await getUser())) return 0

  return await prisma.contactMessage.count({
    where: {
      read: false,
      ...(id && { id: { not: id } }),
    },
  })
}

export async function getContactMessages() {
  if (!(await getUser())) return []

  return await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  })
}

export async function getMessageAndMarkAsRead(id: string) {
  if (!(await getUser())) return null

  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  })

  return message
}

export async function markMessageAsUnread(id: string) {
  if (!(await getUser())) return

  await prisma.contactMessage.update({
    where: { id },
    data: { read: false },
  })

  revalidatePath("/admin/mensagens")

  redirect("/admin/mensagens")
}

export async function deleteContactMessage(id: string) {
  if (!(await getUser())) return

  await prisma.contactMessage.delete({
    where: { id },
  })

  revalidatePath("/admin/mensagens")

  redirect("/admin/mensagens")
}
