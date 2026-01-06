"use client"

import { useState, useTransition, useEffect } from "react"
import { Edit, Check, X, ChevronDown } from "lucide-react"
import { LoadingSpinner } from "./ui/loading-spinner"
import type { Database } from "@/lib/types/database"
import { updateProfile } from "@/app/actions/profile"

interface JobChangeDetailsProps {
  profile: Database['public']['Tables']['profiles']['Row'] | null
  isMasked: boolean
}

const STORAGE_KEY = 'job-change-details-expanded'

export function JobChangeDetails({ profile, isMasked }: JobChangeDetailsProps) {
  const [isPending, startTransition] = useTransition()
  const [isExpanded, setIsExpanded] = useState(true)
  
  const [isEditingPriority, setIsEditingPriority] = useState(false)
  const [editedPriority, setEditedPriority] = useState("")

  const [isEditingReason, setIsEditingReason] = useState(false)
  const [editedReason, setEditedReason] = useState("")

  const [isEditingAvoid, setIsEditingAvoid] = useState(false)
  const [editedAvoid, setEditedAvoid] = useState("")

  // Load expanded state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setIsExpanded(stored === 'true')
    }
  }, [])

  // Save expanded state to localStorage
  const toggleExpanded = () => {
    const newState = !isExpanded
    setIsExpanded(newState)
    localStorage.setItem(STORAGE_KEY, String(newState))
  }

  useEffect(() => {
    if (profile) {
      setEditedPriority(profile.job_change_priority || "")
      setEditedReason(profile.job_change_reason || "")
      setEditedAvoid(profile.job_change_avoid || "")
    }
  }, [profile])

  const handleSavePriority = () => {
    if (!profile) return
    startTransition(async () => {
      await updateProfile({ job_change_priority: editedPriority })
      setIsEditingPriority(false)
    })
  }

  const handleSaveReason = () => {
    if (!profile) return
    startTransition(async () => {
      await updateProfile({ job_change_reason: editedReason })
      setIsEditingReason(false)
    })
  }

  const handleSaveAvoid = () => {
    if (!profile) return
    startTransition(async () => {
      await updateProfile({ job_change_avoid: editedAvoid })
      setIsEditingAvoid(false)
    })
  }

  const renderField = (
    label: string,
    value: string | null,
    isEditing: boolean,
    editedValue: string,
    setEditedValue: (value: string) => void,
    setIsEditing: (value: boolean) => void,
    handleSave: () => void
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#2F80ED] tracking-wide">{label}</h3>
          {!isMasked && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF] transition-colors"
            >
              <Edit className="h-3 w-3" />
            </button>
          )}
        </div>
        {isMasked ? (
          <p className="text-sm text-[#6B7280]">***</p>
        ) : isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              className="w-full text-sm text-[#1F2937] border border-[#2F80ED] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2F80ED] focus:ring-opacity-20 resize-none"
              rows={3}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Escape") setIsEditing(false)
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-3 py-1.5 rounded-lg bg-[#E7F8ED] text-[#34A853] hover:bg-[#D1F2DD] flex items-center gap-1 text-sm font-medium transition-colors"
              >
                {isPending ? <LoadingSpinner size={14} className="text-[#34A853]" /> : <Check className="h-4 w-4" />}
                保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <X className="h-4 w-4" />
                キャンセル
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#1F2937] leading-relaxed whitespace-pre-wrap">
            {value || <span className="text-[#9CA3AF] italic">未設定</span>}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Header with toggle button */}
        <button
          onClick={toggleExpanded}
          className="w-full px-6 py-4 md:px-10 md:py-5 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
        >
          <h2 className="text-base md:text-lg font-semibold text-[#1F2937] tracking-wide">
            転職活動について
          </h2>
          <ChevronDown 
            className={`h-5 w-5 text-[#6B7280] transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Collapsed state - "思考の痕跡" */}
        {!isExpanded && (
          <button
            onClick={toggleExpanded}
            className="w-full px-6 pb-4 md:px-10 md:pb-5 text-left hover:bg-[#F9FAFB] transition-colors"
          >
            <div className="space-y-1.5">
              <p className="text-xs text-[#9CA3AF]/60 leading-relaxed">
                {profile?.job_change_priority 
                  ? "いちばん大事なポイント：記入あり" 
                  : "いちばん大事なポイント：まだ言葉になっていません"}
              </p>
              <p className="text-xs text-[#9CA3AF]/60 leading-relaxed">
                {profile?.job_change_reason 
                  ? "転職理由：記入あり" 
                  : "転職理由：あとから書けます"}
              </p>
              <p className="text-xs text-[#9CA3AF]/60 leading-relaxed">
                {profile?.job_change_avoid 
                  ? "避けたい条件：記入あり" 
                  : "避けたい条件：考え中"}
              </p>
            </div>
          </button>
        )}

        {/* Expanded state - Full content */}
        <div 
          className={`transition-all duration-300 ease-in-out ${
            isExpanded 
              ? 'max-h-[2000px] opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-6 pb-6 md:px-10 md:pb-8 space-y-6 border-t border-[#E5E7EB]">
            <div className="pt-6">
              {renderField(
                "今回の転職でいちばん大事なポイント",
                profile?.job_change_priority || null,
                isEditingPriority,
                editedPriority,
                setEditedPriority,
                setIsEditingPriority,
                handleSavePriority
              )}
            </div>
            
            <div className="h-px bg-[#E5E7EB]" />
            
            {renderField(
              "なぜ、転職しようと思ったのか",
              profile?.job_change_reason || null,
              isEditingReason,
              editedReason,
              setEditedReason,
              setIsEditingReason,
              handleSaveReason
            )}
            
            <div className="h-px bg-[#E5E7EB]" />
            
            {renderField(
              "これは避けたい、という条件",
              profile?.job_change_avoid || null,
              isEditingAvoid,
              editedAvoid,
              setEditedAvoid,
              setIsEditingAvoid,
              handleSaveAvoid
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
