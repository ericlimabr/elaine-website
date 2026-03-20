"use client"

import { markMessageAsUnread } from "@/app/actions/contact"

export default function MarkAsUnreadComponent({ id }: { id: string }) {
  const markCurrentMessageAsRead = async () => {
    await markMessageAsUnread(id)
  }

  return (
    <button
      className="px-8 py-3 border border-gray-200 text-gray-600 hover:bg-gray-100 rounded-xl transition-all font-bold"
      onClick={markCurrentMessageAsRead}
    >
      Marcar como Não Lida
    </button>
  )
}
