"use client"

import { useState, useEffect, useTransition } from "react"
import { createApplication } from "@/app/actions/applications"

interface NewOpportunityBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

type SourceType = "ヘッドハンター" | "ダイレクト" | "リファラル" | "自己応募" | null

interface StatusPreset {
  id: string
  label: string
  stage: string
  status: string
  ball: "my" | "company"
  defaultNextAction: string
}

const statusPresets: StatusPreset[] = [
  {
    id: "hh-scheduling",
    label: "HH面談調整中",
    stage: "ヘッドハンター面談",
    status: "調整中",
    ball: "my",
    defaultNextAction: "ヘッドハンターに候補日を返信",
  },
  {
    id: "casual-scheduling",
    label: "カジュアル面談調整中",
    stage: "カジュアル面談",
    status: "調整中",
    ball: "my",
    defaultNextAction: "カジュアル面談の候補日を返信",
  },
  {
    id: "first-interview-scheduling",
    label: "一次面接調整中",
    stage: "一次面接",
    status: "調整中",
    ball: "my",
    defaultNextAction: "一次面接の候補日を返信",
  },
  {
    id: "second-interview-scheduling",
    label: "二次面接調整中",
    stage: "二次面接",
    status: "調整中",
    ball: "my",
    defaultNextAction: "二次面接の候補日を返信",
  },
]

const stageOptions = ["ヘッドハンター面談", "カジュアル面談", "書類選考", "一次面接", "二次面接", "最終面接"]
const statusOptions = ["こっちボール", "企業ボール", "調整中"]
const positionSuggestions = ["プロダクトマネージャー", "PdM", "プロジェクトマネージャー"]

export function NewOpportunityBottomSheet({ isOpen, onClose }: NewOpportunityBottomSheetProps) {
  const [isPending, startTransition] = useTransition()
  const [source, setSource] = useState<SourceType>(null)
  // const [selectedHeadHunter, setSelectedHeadHunter] = useState<HeadHunter | null>(null) // Removed
  // const [isAddingNewHH, setIsAddingNewHH] = useState(false) // Removed
  // const [newHHName, setNewHHName] = useState("") // Removed
  // const [customHeadHunters, setCustomHeadHunters] = useState<string[]>([]) // Removed
  const [sourceDetail, setSourceDetail] = useState("") // Added for free text input

  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [stage, setStage] = useState("")
  const [status, setStatus] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [interviewDate, setInterviewDate] = useState("")



  const resetForm = () => {
    setSource(null)
    setSourceDetail("")
    setCompany("")
    setPosition("")
    setSelectedPreset(null)
    setShowAdvanced(false)
    setStage("")
    setStatus("")
    setNextAction("")
    setInterviewDate("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handlePresetSelect = (preset: StatusPreset) => {
    setSelectedPreset(preset.id)
    setStage(preset.stage)
    setStatus(preset.status)
    if (!nextAction) {
      setNextAction(preset.defaultNextAction)
    }
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
      
      let stageValue = "research"
      if (stage === "ヘッドハンター面談") stageValue = "research"
      else if (stage === "カジュアル面談") stageValue = "research"
      else if (stage === "書類選考") stageValue = "screening"
      else if (stage.includes("面接")) stageValue = "interviewing"
      
      formData.append("stage", stageValue)
      
      // Append source detail to status_note if present
      let finalStatusNote = nextAction
      if (sourceDetail) {
        finalStatusNote = `${finalStatusNote}\n(紹介: ${sourceDetail})`
      }
      formData.append("status_note", finalStatusNote)

      await createApplication(formData)
      handleClose()
    })
  }

  const isFormValid = company.trim() && position.trim() && stage && status

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

          {/* Status Presets */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">今どんな状態？</label>
            <div className="grid grid-cols-2 gap-2">
              {statusPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className={`relative rounded-lg border-2 p-3 text-left text-sm transition-colors ${
                    selectedPreset === preset.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {selectedPreset === preset.id && <span className="absolute right-2 top-2 text-blue-600">✓</span>}
                  <span className="font-medium text-gray-900">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700"
            >
              細かく設定する
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="mt-3 space-y-3 rounded-lg bg-gray-50 p-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">ステージ</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {stageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">状況</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">選択してください</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
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

          {/* Interview Date */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">面接予定日（任意）</label>
            <input
              type="date"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isFormValid && !isPending ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            {isPending ? "保存中..." : "保存して閉じる"}
          </button>
        </div>
      </div>
    </div>
  )
}
