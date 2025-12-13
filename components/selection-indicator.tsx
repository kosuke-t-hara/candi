type SelectionIndicatorProps = {
  phase: number // 1〜5 を想定
}

export function SelectionIndicator({ phase }: SelectionIndicatorProps) {
  const baseDot = "h-3 w-3 rounded-full transition-transform duration-150"

  const phaseColors: Record<number, string> = {
    1: "bg-gray-400 border-gray-400",
    2: "bg-blue-400 border-blue-400",
    3: "bg-amber-400 border-amber-400",
    4: "bg-orange-500 border-orange-500",
    5: "bg-green-500 border-green-500",
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const isActive = i <= phase
        const activeClass = isActive
          ? `${phaseColors[phase] || "bg-gray-400 border-gray-400"} shadow-[0_0_0_1px_rgba(0,0,0,0.04)]`
          : "bg-gray-200 border border-gray-300"

        return (
          <div
            key={i}
            className={`${baseDot} ${activeClass} hover:scale-125`}
          />
        )
      })}
    </div>
  )
}
