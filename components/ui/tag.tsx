import type React from "react"
interface TagProps {
  children: React.ReactNode
  variant?: "neutral" | "primary" | "success" | "warning" | "outline"
}

export function Tag({ children, variant = "neutral" }: TagProps) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"

  const styles: Record<NonNullable<TagProps["variant"]>, string> = {
    neutral: "bg-gray-100 text-gray-700",
    primary: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-amber-50 text-amber-700",
    outline: "border border-gray-300 text-gray-700 bg-white",
  }

  return <span className={`${base} ${styles[variant]}`}>{children}</span>
}

type StatusType = "企業ボール" | "こっちボール" | "確定"

export function StatusPill({ status }: { status: StatusType }) {
  if (status === "企業ボール") {
    return <Tag variant="primary">企業ボール</Tag>
  }
  if (status === "こっちボール") {
    return <Tag variant="warning">こっちボール</Tag>
  }
  return <Tag variant="neutral">確定</Tag>
}
