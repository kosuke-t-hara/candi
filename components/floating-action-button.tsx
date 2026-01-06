"use client"
import { MessageSquareText } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 flex h-14 w-14 items-center justify-center rounded-full bg-[#2F80ED] text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-600 active:scale-95 z-50"
      aria-label="メモを残す"
    >
      <MessageSquareText className="h-6 w-6" />
    </button>
  )
}
