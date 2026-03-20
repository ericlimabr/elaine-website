import React from "react"
import { Loader2 } from "lucide-react"

export default function AbsoluteScreenLockLoader({
  loading,
  loader,
  onClick,
}: {
  loading: boolean
  loader?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}) {
  return (
    <div
      className={`bg-black/50 w-full h-full z-10 absolute top-0 left-0${loading ? " flex items-center justify-center" : " hidden"}`}
      onClick={onClick}
    >
      {loader && <Loader2 className="h-6 w-6 animate-spin text-white" />}
    </div>
  )
}
