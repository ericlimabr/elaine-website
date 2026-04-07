"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { getUser } from "@/utils/getUser"

export async function getFaqs() {
  return await prisma.faq.findMany({
    orderBy: { order: "asc" },
  })
}

export async function getActiveFaqs() {
  return await prisma.faq.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  })
}

export async function createFaq(data: { question: string; answer: string }) {
  if (!(await getUser())) return { success: false, error: "Não autorizado." }

  const last = await prisma.faq.findFirst({ orderBy: { order: "desc" } })
  const created = await prisma.faq.create({
    data: { ...data, order: (last?.order ?? -1) + 1 },
  })

  revalidatePath("/admin/faq")
  revalidatePath("/contato")
  return { success: true, faq: created }
}

export async function updateFaq(id: string, data: { question?: string; answer?: string; active?: boolean }) {
  if (!(await getUser())) return { success: false, error: "Não autorizado." }

  await prisma.faq.update({ where: { id }, data })

  revalidatePath("/admin/faq")
  revalidatePath("/contato")
  return { success: true }
}

export async function deleteFaq(id: string) {
  if (!(await getUser())) return { success: false, error: "Não autorizado." }

  await prisma.faq.delete({ where: { id } })

  revalidatePath("/admin/faq")
  revalidatePath("/contato")
  return { success: true }
}

export async function reorderFaqs(ids: string[]) {
  if (!(await getUser())) return { success: false, error: "Não autorizado." }

  await Promise.all(
    ids.map((id, index) => prisma.faq.update({ where: { id }, data: { order: index } }))
  )

  revalidatePath("/admin/faq")
  revalidatePath("/contato")
  return { success: true }
}
