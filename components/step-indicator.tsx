"use client"

import type { RejectionStatus } from "@/lib/mock-data"

const PHASE_COLORS: Record<number, { active: string; light: string }> = {
  1: { active: "#FBC02D", light: "#FFF8E1" }, // 書類選考 - Yellow
  2: { active: "#42A5F5", light: "#E3F2FD" }, // 一次面接 - Blue
  3: { active: "#7E57C2", light: "#EDE7F6" }, // 二次面接 - Purple
  4: { active: "#CE93D8", light: "#F3E5F5" }, // 最終面接 - Light Purple
  5: { active: "#81C784", light: "#E8F5E9" }, // 内定 - Green
}

// Default colors for phases beyond 5
const DEFAULT_COLORS = { active: "#90A4AE", light: "#ECEFF1" }

interface StepIndicatorProps {
  stepCurrent: number
  stepTotal: number
  rejectionStatus: RejectionStatus
}

export function StepIndicator({ stepCurrent, stepTotal, rejectionStatus }: StepIndicatorProps) {
  const isRejected = rejectionStatus === "rejected"

  // Get the phase color based on current step
  const getPhaseColor = (step: number) => {
    return PHASE_COLORS[step] || DEFAULT_COLORS
  }

  const currentPhaseColor = getPhaseColor(stepCurrent)

  return (
    <div className="flex items-center gap-2 mt-3">
      {/* Step nodes with connecting lines */}
      <div className="flex items-center flex-1">
        {Array.from({ length: stepTotal }).map((_, index) => {
          const stepNumber = index + 1
          const isCurrent = stepNumber === stepCurrent
          const isPassed = stepNumber < stepCurrent
          const isRejectionPoint = isRejected && isCurrent

          // Determine node color
          let nodeColor = "#E0E0E0" // Default gray for future steps
          if (isPassed) {
            nodeColor = currentPhaseColor.active
          } else if (isCurrent && !isRejected) {
            nodeColor = currentPhaseColor.active
          }

          // Determine line color (line after this node)
          const lineColor = isPassed ? currentPhaseColor.active : "#E0E0E0"

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Node */}
              <div className="relative flex items-center justify-center">
                {isRejectionPoint ? (
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#FFEBEE" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 2L8 8M8 2L2 8" stroke="#E57373" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                ) : (
                  // Normal node
                  <div className="w-3 h-3 rounded-full transition-colors" style={{ backgroundColor: nodeColor }} />
                )}
              </div>

              {/* Connecting line (except for last node) */}
              {stepNumber < stepTotal && <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: lineColor }} />}
            </div>
          )
        })}
      </div>

      {/* Progress badge */}
      <div
        className="px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
        style={{
          backgroundColor: isRejected ? "#FFEBEE" : currentPhaseColor.light,
          color: isRejected ? "#E57373" : currentPhaseColor.active,
        }}
      >
        {isRejected ? `落選（${stepCurrent}/${stepTotal}）` : `${stepCurrent}/${stepTotal}`}
      </div>
    </div>
  )
}
