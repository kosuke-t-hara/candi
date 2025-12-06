"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Search, ChevronDown, ChevronRight, GripVertical, Calendar, Building2, User, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

// Types
type Stage = "書類選考中" | "一次面接" | "二次面接" | "最終面接" | "内定" | "却下"

type Application = {
  id: string
  candidateName: string
  opportunityTitle: string
  corporationName: string
  nextEventDate: string | null
  nextEventTime: string | null
  stage: Stage
  memo: string
  matchScore: number
  progress: number // 0-5
}

// Mock Data
const mockApplications: Application[] = [
  {
    id: "1",
    candidateName: "田中 太郎",
    opportunityTitle: "シニアPdM",
    corporationName: "ゴクラク株式会社",
    nextEventDate: "2025-11-28",
    nextEventTime: "14:00",
    stage: "一次面接",
    memo: "技術面談を希望",
    matchScore: 92,
    progress: 2,
  },
  {
    id: "2",
    candidateName: "佐藤 花子",
    opportunityTitle: "バックエンドエンジニア",
    corporationName: "株式会社RunnerX",
    nextEventDate: "2025-11-27",
    nextEventTime: "10:00",
    stage: "書類選考中",
    memo: "Goの経験豊富",
    matchScore: 88,
    progress: 1,
  },
  {
    id: "3",
    candidateName: "山田 次郎",
    opportunityTitle: "プロダクトデザイナー",
    corporationName: "スソアリ",
    nextEventDate: "2025-11-29",
    nextEventTime: "16:00",
    stage: "二次面接",
    memo: "ポートフォリオ優秀",
    matchScore: 95,
    progress: 3,
  },
  {
    id: "4",
    candidateName: "鈴木 美咲",
    opportunityTitle: "事業開発マネージャー",
    corporationName: "This illusion株式会社",
    nextEventDate: "2025-12-01",
    nextEventTime: "11:00",
    stage: "最終面接",
    memo: "年収交渉中",
    matchScore: 90,
    progress: 4,
  },
  {
    id: "5",
    candidateName: "高橋 健一",
    opportunityTitle: "データサイエンティスト",
    corporationName: "株式会社ゴルベーザ",
    nextEventDate: null,
    nextEventTime: null,
    stage: "内定",
    memo: "オファー提示済み",
    matchScore: 85,
    progress: 5,
  },
  {
    id: "6",
    candidateName: "伊藤 恵子",
    opportunityTitle: "カスタマーサクセス",
    corporationName: "株式会社Bullflare",
    nextEventDate: null,
    nextEventTime: null,
    stage: "却下",
    memo: "スキルミスマッチ",
    matchScore: 65,
    progress: 1,
  },
  {
    id: "7",
    candidateName: "渡辺 翔太",
    opportunityTitle: "フロントエンドエンジニア",
    corporationName: "クルシス株式会社",
    nextEventDate: "2025-11-30",
    nextEventTime: "15:00",
    stage: "一次面接",
    memo: "React経験5年",
    matchScore: 91,
    progress: 2,
  },
  {
    id: "8",
    candidateName: "中村 優子",
    opportunityTitle: "人事マネージャー",
    corporationName: "株式会社Oath Sign",
    nextEventDate: "2025-12-02",
    nextEventTime: "13:00",
    stage: "書類選考中",
    memo: "HRBP経験あり",
    matchScore: 78,
    progress: 1,
  },
]

const stages: Stage[] = ["書類選考中", "一次面接", "二次面接", "最終面接", "内定", "却下"]

const phaseColors = {
  書類選考中: { active: "#FBC02D", light: "#FFF8E1" },
  一次面接: { active: "#42A5F5", light: "#E3F2FD" },
  二次面接: { active: "#7E57C2", light: "#EDE7F6" },
  最終面接: { active: "#CE93D8", light: "#F3E5F5" },
  内定: { active: "#81C784", light: "#E8F5E9" },
  却下: { active: "#9E9E9E", light: "#F5F5F5" },
}

const candidates = [...new Set(mockApplications.map((a) => a.candidateName))]

function getPhaseColorForProgress(progress: number): { active: string; light: string } {
  const phases = ["書類選考中", "一次面接", "二次面接", "最終面接", "内定"] as const
  const phase = phases[Math.min(progress - 1, phases.length - 1)] || "書類選考中"
  return phaseColors[phase]
}

function StepIndicator({
  currentStep,
  totalSteps = 5,
  stage,
}: {
  currentStep: number
  totalSteps?: number
  stage?: Stage
}) {
  // Hide if only 1 step
  if (totalSteps <= 1) return null

  const colors = stage ? phaseColors[stage] : getPhaseColorForProgress(currentStep)
  const inactiveColor = "#E0E0E0"

  return (
    <div className="flex items-center gap-2">
      {/* Line + Dot indicator */}
      <div className="flex items-center flex-1 min-w-0">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i < currentStep
          const nodeColor = isActive ? colors.active : inactiveColor
          const isLast = i === totalSteps - 1

          return (
            <div key={i} className="flex items-center flex-1 min-w-0">
              {/* Node (dot) */}
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 transition-colors"
                style={{
                  backgroundColor: nodeColor,
                  boxShadow: isActive ? `0 0 4px ${colors.active}60` : "none",
                }}
              />
              {/* Line (except after last node) */}
              {!isLast && (
                <div
                  className="h-0.5 flex-1 min-w-1 transition-colors"
                  style={{
                    backgroundColor: i < currentStep - 1 ? colors.active : inactiveColor,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress badge */}
      <span
        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
        style={{
          backgroundColor: colors.light,
          color: colors.active,
        }}
      >
        {currentStep}/{totalSteps}
      </span>
    </div>
  )
}

function ApplicationCard({
  application,
  onDragStart,
}: {
  application: Application
  onDragStart: (e: React.DragEvent, app: Application) => void
}) {
  const formatDate = (date: string | null) => {
    if (!date) return null
    const d = new Date(date)
    const month = d.getMonth() + 1
    const day = d.getDate()
    const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
    const weekday = weekdays[d.getDay()]
    return `${month}/${day}(${weekday})`
  }

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, application)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span className="font-semibold text-gray-900 text-sm truncate">{application.candidateName}</span>
            </div>
          </div>
        </div>
        <span className="flex-shrink-0 bg-pink-100 text-pink-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {application.matchScore}%
        </span>
      </div>

      {/* Opportunity */}
      <div className="mb-2">
        <p className="text-sm font-medium text-gray-800 line-clamp-1">{application.opportunityTitle}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <Building2 className="w-3 h-3" />
          <span className="truncate">{application.corporationName}</span>
        </div>
      </div>

      {/* Next Event */}
      {application.nextEventDate && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-2 bg-gray-50 rounded-lg px-2 py-1.5">
          <Calendar className="w-3 h-3 text-pink-400" />
          <span>
            {formatDate(application.nextEventDate)} {application.nextEventTime}
          </span>
        </div>
      )}

      {/* Memo */}
      <p className="text-xs text-gray-500 line-clamp-1 mb-3">{application.memo}</p>

      <StepIndicator currentStep={application.progress} totalSteps={5} stage={application.stage} />
    </div>
  )
}

function KanbanColumn({
  stage,
  applications,
  onDragStart,
  onDrop,
  onDragOver,
}: {
  stage: Stage
  applications: Application[]
  onDragStart: (e: React.DragEvent, app: Application) => void
  onDrop: (e: React.DragEvent, stage: Stage) => void
  onDragOver: (e: React.DragEvent) => void
}) {
  const colors = phaseColors[stage]

  return (
    <div
      className={`flex-shrink-0 w-72 ${colors.light} rounded-2xl p-3 border ${colors.active}`}
      onDrop={(e) => onDrop(e, stage)}
      onDragOver={onDragOver}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className={`font-semibold text-sm ${colors.active}`}>{stage}</h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white ${colors.active}`}>
          {applications.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-3 min-h-[200px]">
        {applications.map((app) => (
          <ApplicationCard key={app.id} application={app} onDragStart={onDragStart} />
        ))}
        {applications.length === 0 && (
          <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400">
            ドロップしてください
          </div>
        )}
      </div>
    </div>
  )
}

function MobileKanbanAccordion({
  stage,
  applications,
  onDragStart,
  onDrop,
  onDragOver,
}: {
  stage: Stage
  applications: Application[]
  onDragStart: (e: React.DragEvent, app: Application) => void
  onDrop: (e: React.DragEvent, stage: Stage) => void
  onDragOver: (e: React.DragEvent) => void
}) {
  const [isOpen, setIsOpen] = useState(applications.length > 0)
  const colors = phaseColors[stage]

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button
          className={`w-full flex items-center justify-between p-4 ${colors.light} rounded-2xl border ${colors.active} mb-2`}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className={`w-4 h-4 ${colors.active}`} />
            ) : (
              <ChevronRight className={`w-4 h-4 ${colors.active}`} />
            )}
            <span className={`font-semibold text-sm ${colors.active}`}>{stage}</span>
          </div>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white ${colors.active}`}>
            {applications.length}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-3 pb-4 px-1" onDrop={(e) => onDrop(e, stage)} onDragOver={onDragOver}>
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} onDragStart={onDragStart} />
          ))}
          {applications.length === 0 && (
            <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 bg-white">
              ドロップしてください
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default function AgentsPipelinePage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications)
  const [candidateFilter, setCandidateFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [stageFilter, setStageFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("nextEvent")
  const [draggedApp, setDraggedApp] = useState<Application | null>(null)

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let result = [...applications]

    // Candidate filter
    if (candidateFilter !== "all") {
      result = result.filter((a) => a.candidateName === candidateFilter)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (a) => a.opportunityTitle.toLowerCase().includes(query) || a.corporationName.toLowerCase().includes(query),
      )
    }

    // Stage filter
    if (stageFilter !== "all") {
      result = result.filter((a) => a.stage === stageFilter)
    }

    // Sort
    if (sortBy === "nextEvent") {
      result.sort((a, b) => {
        if (!a.nextEventDate) return 1
        if (!b.nextEventDate) return -1
        const dateCompare = a.nextEventDate.localeCompare(b.nextEventDate)
        if (dateCompare !== 0) return dateCompare
        return (a.nextEventTime || "").localeCompare(b.nextEventTime || "")
      })
    } else if (sortBy === "stage") {
      result.sort((a, b) => stages.indexOf(a.stage) - stages.indexOf(b.stage))
    }

    return result
  }, [applications, candidateFilter, searchQuery, stageFilter, sortBy])

  // Group by stage
  const applicationsByStage = useMemo(() => {
    const grouped: Record<Stage, Application[]> = {
      書類選考中: [],
      一次面接: [],
      二次面接: [],
      最終面接: [],
      内定: [],
      却下: [],
    }
    filteredApplications.forEach((app) => {
      grouped[app.stage].push(app)
    })
    return grouped
  }, [filteredApplications])

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, app: Application) => {
    setDraggedApp(app)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStage: Stage) => {
    e.preventDefault()
    if (!draggedApp) return

    setApplications((prev) =>
      prev.map((app) =>
        app.id === draggedApp.id ? { ...app, stage: newStage, progress: stages.indexOf(newStage) + 1 } : app,
      ),
    )
    setDraggedApp(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🍬</span>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Candi for Agents</h1>
                <p className="text-xs text-gray-500">パイプライン管理</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <ArrowLeft className="w-4 h-4" />
                Back to Candidate View
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="sticky top-[57px] z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-3">
            {/* Candidate Selector */}
            <Select value={candidateFilter} onValueChange={setCandidateFilter}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="候補者を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全ての候補者</SelectItem>
                {candidates.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="ポジション・企業名で検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>

            {/* Stage Filter */}
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue placeholder="ステージ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全てのステージ</SelectItem>
                {stages.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] bg-white">
                <SelectValue placeholder="並び替え" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextEvent">次のイベント順</SelectItem>
                <SelectItem value="stage">ステージ順</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-4">
        {/* Desktop: Horizontal Kanban */}
        <div className="hidden md:flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              applications={applicationsByStage[stage]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>

        {/* Mobile: Accordion */}
        <div className="md:hidden space-y-2">
          {stages.map((stage) => (
            <MobileKanbanAccordion
              key={stage}
              stage={stage}
              applications={applicationsByStage[stage]}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
