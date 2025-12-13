type SelectionIndicatorProps = {
  phase: number // 1〜5 を想定
}

export function SelectionIndicator({ phase }: SelectionIndicatorProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`h-3 w-3 rounded-full ${
            i <= phase ? 'bg-yellow-400' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}
