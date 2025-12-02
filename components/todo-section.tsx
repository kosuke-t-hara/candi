"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface TodoSectionProps {
  isMasked: boolean
}

interface TodoItem {
  id: string
  label: string
}

const initialTodos: TodoItem[] = [
  { id: "1", label: "M社Iさん：返信" },
  { id: "2", label: "株式会社L：一次面接調整" },
  { id: "3", label: "株式会社I：カジュアル面談調整" },
]

export function TodoSection({ isMasked }: TodoSectionProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [completingId, setCompletingId] = useState<string | null>(null)

  const handleComplete = (id: string) => {
    setCompletingId(id)
    setTimeout(() => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
      setCompletingId(null)
    }, 350)
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">TO-DO</h2>
      <div className="rounded-[14px] bg-white shadow-sm border border-[#E5E7EB] px-4 py-4">
        {todos.length === 0 ? (
          <p className="text-sm text-[#555]">すべて完了しました</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 transition-opacity duration-300 ${
                  completingId === todo.id ? "opacity-0" : "opacity-100"
                }`}
              >
                <button
                  onClick={() => handleComplete(todo.id)}
                  className="flex-shrink-0 w-5 h-5 rounded border-2 border-[#E5E7EB] hover:border-[#2F80ED] hover:bg-[#E8F1FF] transition-colors duration-150 flex items-center justify-center group"
                  aria-label={`${todo.label}を完了にする`}
                >
                  <Check className="w-3 h-3 text-[#2F80ED] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                </button>
                <span className="text-sm text-[#333]">{todo.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
