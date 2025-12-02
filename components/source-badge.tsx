import type { SourceType } from "@/lib/mock-data"
import { getSourceTypeLabel, getSourceTypeBadgeClasses } from "@/lib/mask-utils"

interface SourceBadgeProps {
  sourceType: SourceType
  sourceLabel: string
}

export function SourceBadge({ sourceType, sourceLabel }: SourceBadgeProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className={getSourceTypeBadgeClasses(sourceType)}>{getSourceTypeLabel(sourceType)}</span>
      <span className="text-[10px] text-gray-500">{sourceLabel}</span>
    </div>
  )
}
