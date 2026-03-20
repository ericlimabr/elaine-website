"use client"

import { useState, useTransition } from "react"
import { deleteContactMessage } from "@/app/actions/contact"
import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/primitives/alert-dialog"

export default function DeleteContactMessage({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        await deleteContactMessage(id)
        toast.success("Mensagem excluída!")
        setOpen(false)
      } catch (error) {
        toast.error("Erro ao excluir.")
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <button
          disabled={isPending}
          className="ml-auto flex items-center px-5 py-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all font-bold group disabled:opacity-50"
        >
          <Trash2 className="h-5 w-5 mr-2 text-red-400 group-hover:text-red-600" />
          {isPending ? "Excluindo..." : "Excluir"}
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir esta mensagem permanentemente?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleConfirmDelete()
            }}
            className="bg-red-600 text-white hover:bg-red-700 font-bold"
            disabled={isPending}
          >
            {isPending ? "Excluindo..." : "Sim, excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
