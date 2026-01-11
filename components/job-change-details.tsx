"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Database } from "@/lib/types/database"
import { ToroComposer } from "@/app/components/toro/ToroComposer"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

// Local interface definition matching HomePageClient
interface ToroEntry {
  id: string
  user_id: string
  content: string
  context: any
  created_at: string
  updated_at: string
  archived_at: string | null
}

interface JobChangeDetailsProps {
  profile: Database['public']['Tables']['profiles']['Row'] | null
  isMasked: boolean
  entries?: {
    priority: ToroEntry | null
    reason: ToroEntry | null
    avoid: ToroEntry | null
  }
}

const STORAGE_KEY = 'job-change-details-expanded'

export function JobChangeDetails({ profile, isMasked, entries }: JobChangeDetailsProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeSheet, setActiveSheet] = useState<'priority' | 'reason' | 'avoid' | null>(null)

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

  const handleSaved = () => {
    setActiveSheet(null)
    router.refresh()
  }

  const renderField = (
    label: string,
    entry: ToroEntry | null,
    sheetType: 'priority' | 'reason' | 'avoid'
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#2F80ED] tracking-wide">{label}</h3>
          {!isMasked && (
             <button
               onClick={() => setActiveSheet(sheetType)}
               className="p-1 rounded-full hover:bg-[#F5F6F8] text-[#9CA3AF] transition-colors"
             >
               <Edit className="h-3 w-3" />
             </button>
           )}
        </div>
        {isMasked ? (
          <p className="text-sm text-[#6B7280]">***</p>
        ) : (
          <div 
            onClick={() => setActiveSheet(sheetType)}
            className="group cursor-pointer rounded-lg hover:bg-[#F9FAFB] -ml-2 p-2 transition-colors"
          >
            <p className="text-base text-[#1F2937] leading-relaxed whitespace-pre-wrap">
              {entry?.content || <span className="text-[#9CA3AF] italic">未設定</span>}
            </p>
          </div>
        )}
      </div>
    )
  }

  const getPlaceholder = (type: 'priority' | 'reason' | 'avoid') => {
    switch(type) {
      case 'priority': return "今回の転職で、絶対に譲れないポイントは何ですか？"
      case 'reason': return "転職を考え始めたきっかけや、現状の課題は何ですか？"
      case 'avoid': return "これだけは避けたい、という条件や環境はありますか？"
    }
  }
  
  const getContext = (type: 'priority' | 'reason' | 'avoid') => {
     return { type: `job_change_${type}` }
  }

  const getActiveEntry = () => {
    if (!activeSheet || !entries) return null
    return entries[activeSheet]
  }

  // Determine active title
  const getSheetTitle = () => {
    switch(activeSheet) {
      case 'priority': return "今回の転職でいちばん大事なポイント"
      case 'reason': return "なぜ、転職しようと思ったのか"
      case 'avoid': return "これは避けたい、という条件"
      default: return ""
    }
  }

  return (
    <>
      <div className="mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden">
          {/* Header with toggle button */}
          <button
            onClick={toggleExpanded}
            className="w-full px-6 py-4 md:px-10 md:py-5 flex items-center justify-between hover:bg-[#F9FAFB] transition-colors"
          >
            <h2 className="text-base md:text-lg font-semibold text-[#1F2937] tracking-wide">
              あなたの転職活動について
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
                  いちばん大事なポイント：
                  {entries?.priority 
                    ? "記入あり" 
                    : <span className="text-[#2F80ED]">まだ言葉になっていません</span>}
                </p>
                <p className="text-xs text-[#9CA3AF]/60 leading-relaxed">
                  転職理由：
                  {entries?.reason 
                    ? "記入あり" 
                    : <span className="text-[#2F80ED]">あとから書けます</span>}
                </p>
                <p className="text-xs text-[#9CA3AF]/60 leading-relaxed">
                  避けたい条件：
                  {entries?.avoid 
                    ? "記入あり" 
                    : <span className="text-[#2F80ED]">考え中</span>}
                </p>
              </div>
            </button>
          )}
  
          {/* Collapsible content */}
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
                  entries?.priority || null,
                  'priority'
                )}
              </div>
              
              <div className="h-px bg-[#E5E7EB]" />
              
              {renderField(
                "なぜ、転職しようと思ったのか",
                entries?.reason || null,
                'reason'
              )}
              
              <div className="h-px bg-[#E5E7EB]" />
              
              {renderField(
                "これは避けたい、という条件",
                entries?.avoid || null,
                'avoid'
              )}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={!!activeSheet} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="bottom" className="h-[80vh] bg-white rounded-t-[20px] p-0 border-none overflow-hidden max-w-[640px] mx-auto inset-x-0">
          <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
            <SheetHeader className="px-6 py-4 border-b border-black/5 flex-shrink-0">
              <SheetTitle className="text-xl font-medium text-black/80">{getSheetTitle()}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-2">
              {activeSheet && (
                <ToroComposer 
                  isAuthenticated={!!profile} 
                  defaultValue={getActiveEntry()?.content || ""}
                  onSaved={handleSaved}
                  context={getContext(activeSheet)}
                  className="mt-0"
                  placeholder={getPlaceholder(activeSheet)}
                  label={getSheetTitle()}
                />
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
