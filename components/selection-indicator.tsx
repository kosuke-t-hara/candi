type SelectionIndicatorProps = {
  phase: number // 1〜5 を想定
  isArchived?: boolean
}

export function SelectionIndicator({ phase, isArchived = false }: SelectionIndicatorProps) {
  const baseDot = "h-3 w-3 rounded-full transition-transform duration-150"

  const phaseColors: Record<number, string> = {
    1: "bg-green-400 border-green-400",
    2: "bg-blue-400 border-blue-400",
    3: "bg-purple-400 border-purple-400",
    4: "bg-orange-500 border-orange-500",
    5: "bg-red-500 border-red-500",
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const isActive = i <= phase
        
        let colorClass = "bg-gray-200 border border-gray-300" // Inactive default
        
        if (isActive) {
            if (isArchived) {
                colorClass = "bg-gray-400 border-gray-400 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]" // Gray for archived
            } else {
                colorClass = `${phaseColors[phase] || "bg-gray-400 border-gray-400"} shadow-[0_0_0_1px_rgba(0,0,0,0.04)]`
            }
        }

        return (
          <div
            key={i}
            className={`${baseDot} ${colorClass} hover:scale-125`}
          />
        )
      })}
    </div>
  )
}
