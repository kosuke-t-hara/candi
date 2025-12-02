"use client"

import { useState, useEffect } from "react"

interface NewOpportunityBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

type SourceType = "ヘッドハンター" | "ダイレクト" | "リファラル" | "自己応募" | null
type HeadHunter = "FLUX 小池" | "ビズリーチ" | "Sun* 黒岡" | string

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

const defaultHeadHunters: HeadHunter[] = ["FLUX 小池", "ビズリーチ", "Sun* 黒岡"]

export function NewOpportunityBottomSheet({ isOpen, onClose }: NewOpportunityBottomSheetProps) {
  const [source, setSource] = useState<SourceType>(null)
  const [selectedHeadHunter, setSelectedHeadHunter] = useState<HeadHunter | null>(null)
  const [isAddingNewHH, setIsAddingNewHH] = useState(false)
  const [newHHName, setNewHHName] = useState("")
  const [customHeadHunters, setCustomHeadHunters] = useState<string[]>([])

  const [company, setCompany] = useState("")
  const [position, setPosition] = useState("")
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [stage, setStage] = useState("")
  const [status, setStatus] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [interviewDate, setInterviewDate] = useState("")

  const allHeadHunters = [...defaultHeadHunters, ...customHeadHunters]

  const resetForm = () => {
    setSource(null)
    setSelectedHeadHunter(null)
    setIsAddingNewHH(false)
    setNewHHName("")
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

  const handleAddNewHeadHunter = () => {
    if (newHHName.trim()) {
      setCustomHeadHunters((prev) => [...prev, newHHName.trim()])
      setSelectedHeadHunter(newHHName.trim())
      setNewHHName("")
      setIsAddingNewHH(false)
    }
  }

  const handleSave = () => {
    const newOpportunity = {
      source,
      headHunter: source === "ヘッドハンター" ? selectedHeadHunter : null,
      company,
      position,
      stage,
      status,
      nextAction,
      interviewDate: interviewDate || null,
    }
    console.log("New opportunity created:", newOpportunity)
    handleClose()
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
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 flex max-h-[80vh] flex-col rounded-t-2xl bg-white animate-in slide-in-from-bottom duration-300">
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
              {(["ヘッドハンター", "ダイレクト", "リファラル", "自分で応募"] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSource(option)
                    if (option !== "ヘッドハンター") {
                      setSelectedHeadHunter(null)
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

            {/* Head Hunter Selection */}
            {source === "ヘッドハンター" && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {allHeadHunters.map((hh) => (
                    <button
                      key={hh}
                      onClick={() => setSelectedHeadHunter(hh)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                        selectedHeadHunter === hh
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {hh}
                    </button>
                  ))}
                  <button
                    onClick={() => setIsAddingNewHH(true)}
                    className="rounded-full border-2 border-dashed border-gray-300 px-3 py-1.5 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600"
                  >
                    新しいヘッドハンターを追加…
                  </button>
                </div>
                {isAddingNewHH && (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      value={newHHName}
                      onChange={(e) => setNewHHName(e.target.value)}
                      placeholder="例）Sun*田中さん"
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddNewHeadHunter}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      追加
                    </button>
                  </div>
                )}
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
              placeholder="例）LayerX"
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
            disabled={!isFormValid}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isFormValid ? "bg-blue-600 text-white hover:bg-blue-700" : "cursor-not-allowed bg-gray-200 text-gray-400"
            }`}
          >
            保存して閉じる
          </button>
        </div>
      </div>
    </div>
  )
}
