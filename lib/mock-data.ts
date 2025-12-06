export type SourceType = "agent" | "direct" | "self" | "referral" | "other"
export type ApplicationEventStatus = "confirmed" | "candidate"
export type ApplicationLifecycleStatus = "ongoing" | "closed"
export type RejectionStatus = "active" | "rejected"

export interface ApplicationEvent {
  id: string
  date: string // "YYYY-MM-DD"
  startTime: string
  endTime: string
  type: string // "カジュアル面談", "一次面接", etc
  status: ApplicationEventStatus
  title?: string
  person?: string
  note: string
}

export interface ApplicationTodo {
  id: string
  text: string
  completed: boolean
}

export interface Application {
  id: string
  company: string
  position: string
  stage: string
  status: string
  nextAction: string
  scheduledDate: string
  startTime: string
  endTime: string
  memo: string
  sourceType: SourceType
  sourceLabel: string
  events: ApplicationEvent[]
  globalNote: string
  todos: ApplicationTodo[]
  applicationStatus: ApplicationLifecycleStatus
  stepCurrent: number
  stepTotal: number
  rejectionStatus: RejectionStatus
}

export type GrowthLogCategory = "input" | "output" | "community" | "project" | "other"
export type GrowthLogType = "勉強会" | "登壇" | "執筆" | "読書" | "オンライン講座" | "その他"
export type GrowthLogSource = "manual" | "google_calendar" | "imported" | "other"

export interface GrowthLog {
  id: string
  title: string
  category: GrowthLogCategory
  type: GrowthLogType
  date: string // "YYYY-MM-DD"
  startTime: string
  endTime: string
  memo?: string
  source: GrowthLogSource
  createdAt: string
  updatedAt: string
}

export const applications: Application[] = [
  {
    id: "1",
    company: "スソアリ",
    position: "VPoP候補",
    stage: "一次面接",
    status: "確定",
    nextAction: "なし",
    scheduledDate: "2025-11-26",
    startTime: "16:00",
    endTime: "17:00",
    memo: "ー",
    sourceType: "direct",
    sourceLabel: "",
    applicationStatus: "ongoing",
    stepCurrent: 2,
    stepTotal: 5,
    rejectionStatus: "active",
    events: [
      {
        id: "e1-1",
        date: "2025-11-20",
        startTime: "19:00",
        endTime: "20:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "採用担当 山田さん",
        note: "プロダクトビジョンと組織カルチャーについて詳しく聞けた。現場の課題感が明確で、やりがいがありそう。",
      },
      {
        id: "e1-2",
        date: "2025-11-26",
        startTime: "16:00",
        endTime: "17:00",
        type: "一次面接",
        status: "confirmed",
        person: "VPoP 佐藤さん",
        note: "",
      },
    ],
    globalNote: "事業成長フェーズで、プロダクト組織の立ち上げに関われそう。給与レンジも希望に合致。",
    todos: [
      { id: "t1-1", text: "一次面接の逆質問を準備", completed: false },
      { id: "t1-2", text: "プロダクトロードマップを確認", completed: false },
    ],
  },
  {
    id: "2",
    company: "株式会社This illusion",
    position: "PdM",
    stage: "カジュアル面談",
    status: "確定",
    nextAction: "なし",
    scheduledDate: "2025-11-27",
    startTime: "12:00",
    endTime: "13:00",
    memo: "ー",
    sourceType: "direct",
    sourceLabel: "",
    applicationStatus: "ongoing",
    stepCurrent: 1,
    stepTotal: 4,
    rejectionStatus: "active",
    events: [
      {
        id: "e2-1",
        date: "2025-11-27",
        startTime: "12:00",
        endTime: "13:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "PdM 鈴木さん",
        note: "",
      },
    ],
    globalNote: "建設業界のDXに興味あり。まずはカジュアルに話を聞いてみる。",
    todos: [{ id: "t2-1", text: "建設業界の市場調査", completed: false }],
  },
  {
    id: "3",
    company: "ゴクラク",
    position: "PdM",
    stage: "一次面接",
    status: "確定",
    nextAction: "なし",
    scheduledDate: "2025-11-27",
    startTime: "19:00",
    endTime: "20:00",
    memo: "ー",
    sourceType: "direct",
    sourceLabel: "",
    applicationStatus: "ongoing",
    stepCurrent: 2,
    stepTotal: 5,
    rejectionStatus: "active",
    events: [
      {
        id: "e3-1",
        date: "2025-11-18",
        startTime: "18:00",
        endTime: "19:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "事業開発部 部長 田中さん",
        note: "事業戦略の話が中心だった。印刷業界のDXという明確なミッション。チームの雰囲気も良さそう。",
      },
      {
        id: "e3-2",
        date: "2025-11-27",
        startTime: "19:00",
        endTime: "20:00",
        type: "一次面接",
        status: "confirmed",
        person: "プロダクト本部長",
        note: "",
      },
    ],
    globalNote: "給与レンジの話あり。希望範囲内で調整可能とのこと。事業の成長性も高く、非常に魅力的。",
    todos: [
      { id: "t3-1", text: "印刷業界の競合分析", completed: true },
      { id: "t3-2", text: "一次面接の逆質問リスト作成", completed: false },
    ],
  },
  {
    id: "4",
    company: "RunnerX",
    position: "PdM",
    stage: "カジュアル面談",
    status: "確定",
    nextAction: "なし",
    scheduledDate: "2025-11-27",
    startTime: "09:30",
    endTime: "10:00",
    memo: "ー",
    sourceType: "direct",
    sourceLabel: "",
    applicationStatus: "ongoing",
    stepCurrent: 1,
    stepTotal: 5,
    rejectionStatus: "active",
    events: [
      {
        id: "e4-1",
        date: "2025-11-27",
        startTime: "09:30",
        endTime: "10:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "PdM リード",
        note: "",
      },
    ],
    globalNote: "Web3領域に興味あり。技術的な挑戦ができそう。",
    todos: [],
  },
  {
    id: "5",
    company: "株式会社Oath sign",
    position: "PdM",
    stage: "カジュアル面談",
    status: "確定",
    nextAction: "なし",
    scheduledDate: "2025-11-28",
    startTime: "18:00",
    endTime: "19:00",
    memo: "ー",
    sourceType: "agent",
    sourceLabel: "o社 S",
    applicationStatus: "ongoing",
    stepCurrent: 1,
    stepTotal: 4,
    rejectionStatus: "active",
    events: [
      {
        id: "e5-1",
        date: "2025-11-28",
        startTime: "18:00",
        endTime: "19:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "CPO",
        note: "",
      },
    ],
    globalNote: "金融×テクノロジー。安定性と挑戦のバランスが良さそう。",
    todos: [{ id: "t5-1", text: "o社 Sさんへ結果確認", completed: false }],
  },
  {
    id: "6",
    company: "TechVenture Inc.",
    position: "シニアPdM",
    stage: "二次面接",
    status: "落選",
    nextAction: "なし",
    scheduledDate: "2025-11-20",
    startTime: "14:00",
    endTime: "15:00",
    memo: "スキルマッチせず",
    sourceType: "agent",
    sourceLabel: "R社 田中",
    applicationStatus: "closed",
    stepCurrent: 3,
    stepTotal: 5,
    rejectionStatus: "rejected",
    events: [
      {
        id: "e6-1",
        date: "2025-11-10",
        startTime: "10:00",
        endTime: "11:00",
        type: "カジュアル面談",
        status: "confirmed",
        person: "HR",
        note: "カルチャーフィットは良好",
      },
      {
        id: "e6-2",
        date: "2025-11-15",
        startTime: "14:00",
        endTime: "15:00",
        type: "一次面接",
        status: "confirmed",
        person: "PdMリード",
        note: "技術的な深掘りあり",
      },
      {
        id: "e6-3",
        date: "2025-11-20",
        startTime: "14:00",
        endTime: "15:00",
        type: "二次面接",
        status: "confirmed",
        person: "CTO",
        note: "技術スタックの経験不足を指摘された",
      },
    ],
    globalNote: "二次面接で落選。技術スタックの経験が求められていた。",
    todos: [],
  },
]

export const growthLogs: GrowthLog[] = [
  {
    id: "growth-1",
    title: "React勉強会",
    category: "input",
    type: "勉強会",
    date: "2025-11-28",
    startTime: "19:00",
    endTime: "20:30",
    memo: "React 19の新機能とServer Componentsについて学ぶ",
    source: "manual",
    createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2025-11-20T10:00:00Z",
  },
  {
    id: "growth-2",
    title: "LT登壇",
    category: "output",
    type: "登壇",
    date: "2025-11-29",
    startTime: "18:00",
    endTime: "19:00",
    memo: "プロダクトマネジメントの実践知を共有する",
    source: "manual",
    createdAt: "2025-11-21T09:00:00Z",
    updatedAt: "2025-11-21T09:00:00Z",
  },
  {
    id: "growth-3",
    title: "TypeScript読書会",
    category: "input",
    type: "読書",
    date: "2025-11-30",
    startTime: "10:00",
    endTime: "11:30",
    memo: "プログラミングTypeScript輪読会 第5章",
    source: "manual",
    createdAt: "2025-11-22T08:00:00Z",
    updatedAt: "2025-11-22T08:00:00Z",
  },
]

export function getGrowthLogCategoryLabel(category: GrowthLogCategory): string {
  const labels: Record<GrowthLogCategory, string> = {
    input: "技術学習",
    output: "アウトプット",
    community: "コミュニティ",
    project: "プロジェクト",
    other: "その他",
  }
  return labels[category]
}
