import { useState, useTransition, useEffect } from "react"
import { MaskToggle } from "./mask-toggle"
import { Tag } from "./ui/tag"
import { Check, Edit, X } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import type { Database } from "@/lib/types/database"
import { updateProfile } from "@/app/actions/profile"

interface CandidateSummaryProps {
  isMasked: boolean
  onToggleMask: () => void
  profile: Database['public']['Tables']['profiles']['Row'] | null
  ongoingCount: number
  weeklyCount: number
  onOngoingClick: () => void
}

export function CandidateSummary({ 
  isMasked, 
  onToggleMask, 
  profile,
  ongoingCount,
  weeklyCount,
  onOngoingClick
}: CandidateSummaryProps) {
  const [isPending, startTransition] = useTransition()
  
  const [isEditingName, setIsEditingName] = useState(false)
  const [editedName, setEditedName] = useState("")

  const [isEditingIncome, setIsEditingIncome] = useState(false)
  const [editedIncomeMin, setEditedIncomeMin] = useState("")
  const [editedIncomeMax, setEditedIncomeMax] = useState("")

  useEffect(() => {
    if (profile) {
      setEditedName(profile.display_name || "")
      setEditedIncomeMin(profile.desired_annual_income_min?.toString() || "")
      setEditedIncomeMax(profile.desired_annual_income_max?.toString() || "")
    }
  }, [profile])

  const handleSaveName = () => {
    if (!profile) return
    startTransition(async () => {
      await updateProfile({ display_name: editedName })
      setIsEditingName(false)
    })
  }

  const handleSaveIncome = () => {
    if (!profile) return
    const minVal = editedIncomeMin ? parseInt(editedIncomeMin, 10) : null
    const maxVal = editedIncomeMax ? parseInt(editedIncomeMax, 10) : null

    startTransition(async () => {
      await updateProfile({ 
        desired_annual_income_min: minVal,
        desired_annual_income_max: maxVal 
      })
      setIsEditingIncome(false)
    })
  }

  return (
    <section className="rounded-2xl bg-white shadow-sm border border-[#E5E7EB] px-4 py-4 md:px-8 md:py-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937] tracking-[0.25px] flex items-center gap-2 group min-h-[32px]">
            {isMasked ? (
              "Masked User"
            ) : isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="text-xl font-bold text-[#1F2937] border-b-2 border-[#2F80ED] focus:outline-none bg-transparent max-w-[200px]"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName()
                    if (e.key === "Escape") setIsEditingName(false)
                  }}
                />
                <button
                  onClick={handleSaveName}
                  disabled={isPending}
                  className="p-1 rounded-full bg-[#E7F8ED] text-[#34A853] hover:bg-[#D1F2DD] flex items-center justify-center min-w-[28px] min-h-[28px]"
                >
                  {isPending ? <LoadingSpinner size={16} className="text-[#34A853]" /> : <Check className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                {profile?.display_name || "名無しさん"}
                <button
                  onClick={() => setIsEditingName(true)}
                  className="transition-opacity p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF]"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </>
            )}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#1F2937]">
            <span className="tracking-[0.25px] flex items-center gap-1 group min-h-[28px]">
              {isEditingIncome ? (
                <div className="flex items-center gap-1">
                  希望年収
                  <input
                    type="number"
                    value={editedIncomeMin}
                    onChange={(e) => setEditedIncomeMin(e.target.value)}
                    className="text-sm text-[#1F2937] border-b border-[#2F80ED] focus:outline-none bg-transparent w-[60px]"
                    placeholder="下限"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveIncome()
                      if (e.key === "Escape") setIsEditingIncome(false)
                    }}
                  />
                  <span className="text-gray-400">〜</span>
                  <input
                    type="number"
                    value={editedIncomeMax}
                    onChange={(e) => setEditedIncomeMax(e.target.value)}
                    className="text-sm text-[#1F2937] border-b border-[#2F80ED] focus:outline-none bg-transparent w-[60px]"
                    placeholder="上限"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveIncome()
                      if (e.key === "Escape") setIsEditingIncome(false)
                    }}
                  />
                  万円
                  <button
                    onClick={handleSaveIncome}
                    disabled={isPending}
                    className="p-0.5 rounded-full bg-[#E7F8ED] text-[#34A853] hover:bg-[#D1F2DD] ml-1 flex items-center justify-center min-w-[20px] min-h-[20px]"
                  >
                    {isPending ? <LoadingSpinner size={12} className="text-[#34A853]" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => setIsEditingIncome(false)}
                    className="p-0.5 rounded-full hover:bg-gray-100 text-gray-400"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  希望年収 {
                    (profile?.desired_annual_income_min || profile?.desired_annual_income_max) 
                      ? `${profile.desired_annual_income_min || "未設定"}万円 〜 ${profile.desired_annual_income_max || "未設定"}万円`
                      : "未設定"
                  }
                  {!isMasked && (
                    <button
                      onClick={() => setIsEditingIncome(true)}
                      className="transition-opacity p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF]"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                  )}
                </>
              )}
            </span>
            <div onClick={onOngoingClick} className="cursor-pointer hover:opacity-80 transition-opacity">
              <Tag variant="success">進行中の応募 {ongoingCount}</Tag>
            </div>
            <Tag variant="primary">今週の転職活動 {weeklyCount}</Tag>
          </div>
        </div>
        <MaskToggle isMasked={isMasked} onToggle={onToggleMask} />
      </div>
    </section>
  )
}
