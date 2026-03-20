"use client"

import { useState } from "react"
import { Toaster } from "@/components/ui/primitives/toaster"
import { Toaster as Sonner } from "@/components/ui/primitives/sonner"
import { TooltipProvider } from "@/components/ui/primitives/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

interface AdminLayoutComponentProps {
  children: React.ReactNode
}

export default function AdminLayoutProvider({
  children,
}: AdminLayoutComponentProps) {
  // In Next.js, we create the QueryClient inside a state to avoid
  // that it be recreated each time the component is re-rendered
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  )
}
