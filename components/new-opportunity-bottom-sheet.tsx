"use client"

import { useState, useEffect, useTransition } from "react"
import { createApplication } from "@/app/actions/applications"
import { addApplicationLink } from "@/app/actions/links"
import type { ApplicationLink } from "@/lib/mock-data"
import { LinkSection } from "./link-section"
import { LoadingSpinner } from "./ui/loading-spinner"
import { LoadingOverlay } from "./ui/loading-overlay"

interface NewOpportunityBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

type SourceType = "ヘッドハンター" | "ダイレクト" | "リファラル" | "自己応募" | null

const positionSuggestions = ["法人営業", "デザイナー", "システムエンジニア", "プロダクトマネージャー", "プロジェクトマネージャー", "コーポレート", "マーケティング", "カスタマーサービス", "カスタマーサクセス", "コンサルティング", "経営", "経理", "人事", "HRBP", "その他"]


export function NewOpportunityBottomSheet({ isOpen, onClose }: NewOpportunityBottomSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [source, setSource] = useState<SourceType>(null)
  const [sourceDetail, setSourceDetail] = useState("") 
  const [pendingLinks, setPendingLinks] = useState<ApplicationLink[]>([])

  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [nextAction, setNextAction] = useState("")

  const resetForm = () => {
    setSource(null)
    setSourceDetail("")
    setCompany("")
    setPosition("")
    setNextAction("")
    setPendingLinks([])
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = () => {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("company_name", company)
      formData.append("position_title", position)
      
      let sourceValue = "other"
      if (source === "ヘッドハンター") sourceValue = "agent"
      else if (source === "ダイレクト") sourceValue = "direct"
      else if (source === "リファラル") sourceValue = "referral"
      else if (source === "自己応募") sourceValue = "self"
      
      formData.append("source", sourceValue)
      
      // Defaulting to research as it's a new opportunity
      formData.append("stage", "research")
      
      // Append source detail to status_note if present
      let finalStatusNote = nextAction
      if (sourceDetail) {
        finalStatusNote = `${finalStatusNote}\n(紹介: ${sourceDetail})`
      }
      formData.append("status_note", finalStatusNote)

      const newApp = await createApplication(formData)
      
      if (newApp && pendingLinks.length > 0) {
        for (const link of pendingLinks) {
          await addApplicationLink(newApp.id, link.url, link.label || undefined)
        }
      }

      handleClose()
    })
  }

  const isFormValid = company.trim() && position.trim()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Bottom Sheet */}
      <div className="w-full max-w-[640px] flex max-h-[80vh] flex-col rounded-t-3xl bg-white animate-in slide-in-from-bottom duration-300 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <h2 className="text-lg font-bold text-gray-900">新しい案件を追加</h2>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Source Section */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">どこからの紹介？</label>
            <div className="flex flex-wrap gap-2">
              {(["ヘッドハンター", "ダイレクト", "リファラル", "自己応募"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSource(option)
                    if (option !== "ヘッドハンター" && option !== "リファラル") {
                      setSourceDetail("")
                    }
                  }}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    source === option ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Source Detail Input */}
            {(source === "ヘッドハンター" || source === "リファラル") && (
              <div className="mt-3">
                <input
                  type="text"
                  value={sourceDetail}
                  onChange={(e) => setSourceDetail(e.target.value)}
                  placeholder={source === "ヘッドハンター" ? "例）Candi-Agentsなど" : "例）元同僚の佐藤さん"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Company Name */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">企業名</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="例）株式会社Candi"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Position */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">ポジション</label>
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="例）プロダクトマネージャー"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {positionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPosition(suggestion)}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 hover:bg-gray-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Next Action */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">次のアクション</label>
            <textarea
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="例）一次面接の候補日を今日中に返信"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Links */}
          <div className="mb-6">
            <LinkSection 
              links={pendingLinks}
              onAddLink={async (url, label) => {
                const newLink: ApplicationLink = { 
                  id: crypto.randomUUID(), 
                  url, 
                  label: label || null 
                }
                setPendingLinks(prev => [...prev, newLink])
              }}
              onDeleteLink={async (id) => {
                setPendingLinks(prev => prev.filter(l => l.id !== id))
              }}
              title="関連リンク"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <button onClick={handleClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid || isPending}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors min-w-[100px] flex items-center justify-center ${
              isFormValid && !isPending ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner size={16} className="text-white" />
                <span>保存中...</span>
              </div>
            ) : (
              "保存して閉じる"
            )}
          </button>
        </div>
      </div>
      
      <LoadingOverlay isVisible={isPending} />
    </div>
  )
}
