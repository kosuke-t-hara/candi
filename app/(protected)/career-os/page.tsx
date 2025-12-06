"use client"

import { ArrowLeft, MoreVertical } from "lucide-react"
import Link from "next/link"
import { applications } from "@/lib/mock-data"

export default function CareerOSPage() {
  // Calculate fit scores for ongoing applications
  const ongoingApps = applications.filter((app) => app.applicationStatus === "ongoing")

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">キャリアOSナビ</h1>
          <button className="text-gray-600 hover:text-gray-900">
            <MoreVertical className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {/* Section 1: Current Position */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
          <div className="absolute left-0 top-0 h-full w-1 bg-[#A5C9F5]" />
          <div className="flex items-start gap-3">
            <span className="text-2xl">🧭</span>
            <div className="flex-1">
              <h2 className="mb-2 text-base font-semibold text-[#1F2937]">あなたの現在地</h2>
              <p className="text-sm leading-relaxed text-[#6B7280]">
                あなたは現在「成長志向 × 裁量重視」の状態にあります。
                新しい挑戦や自由度の高い環境で最も力を発揮しやすいタイプです。
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Value Trends */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-1 text-base font-semibold text-[#1F2937]">価値観の推移</h2>
          <p className="mb-4 text-xs text-[#9CA3AF]">最近の回答データから、価値観の変化を分析しました。</p>

          {/* Simple sparkline visualization */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#3B82F6]" />
                <span className="text-xs text-[#6B7280]">成長</span>
              </div>
              <div className="h-12 flex-1">
                <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#3B82F6" strokeWidth="2" points="0,30 20,25 40,28 60,20 80,15 100,10" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8B5CF6]" />
                <span className="text-xs text-[#6B7280]">裁量</span>
              </div>
              <div className="h-12 flex-1">
                <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#8B5CF6" strokeWidth="2" points="0,25 20,20 40,22 60,18 80,12 100,8" />
                </svg>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#10B981]" />
                <span className="text-xs text-[#6B7280]">WLB</span>
              </div>
              <div className="h-12 flex-1">
                <svg viewBox="0 0 100 40" className="h-full w-full" preserveAspectRatio="none">
                  <polyline fill="none" stroke="#10B981" strokeWidth="2" points="0,35 20,32 40,30 60,28 80,25 100,22" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: AI Deep Insight */}
        <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm">
          {/* Gradient accent line */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#3B82F6] to-[#E8F0FE]" />

          {/* Header */}
          <div className="mb-4 flex items-center gap-2 pl-2">
            <span className="text-xl">✨</span>
            <h2 className="text-lg font-bold text-[#1F2937]">AI深層インサイト</h2>
          </div>

          {/* Section 1: Inner Voice - Detailed text */}
          <div className="mb-4 pl-2">
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">あなたの内側にある声</h3>
            <div className="space-y-3 rounded-xl bg-[#F9FAFB] p-4">
              <p className="text-sm leading-relaxed text-[#4B5563]">
                最近の回答から、あなたの中で『挑戦したい気持ち』と『家族を支えたい責任感』が同時に強まっています。
              </p>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                現職では、
                <br />
                ・プロダクトが事業全体の中で小さく扱われる
                <br />
                ・成果が数字として評価されにくい
                <br />
                ・守りの業務が増え、あなた本来の"攻めの力"が出し切れない
              </p>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                こうした環境が、あなたの自信を静かに揺らしています。
              </p>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                その一方で、『もっと成長できる場所に移りたい』という思いが、ここ数ヶ月で確かに強まっています。
              </p>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                転職活動で成果が出にくい状況が続き、あなたは『自分は本当に必要とされるのか？』という不安を抱き始めています。
              </p>
              <p className="text-sm leading-relaxed text-[#4B5563]">
                しかし、過去の行動を読み解くと、あなたは変化に向き合ったときにこそ最も力を発揮してきました。
              </p>
              <p className="text-sm font-medium leading-relaxed text-[#1F2937]">
                その"前向きな火種"は、まだ消えていません。
              </p>
            </div>
          </div>

          {/* Section 2: Keyword Badges - Emotion-based colors */}
          <div className="mb-4 pl-2">
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">あなたを表すキーワード</h3>
            <div className="flex flex-wrap gap-2">
              {/* Blue - 意欲 */}
              <span className="rounded-full bg-[#DBEAFE] px-3 py-1.5 text-xs font-medium text-[#1E40AF]">
                環境を変えたい高まり続ける意欲
              </span>
              {/* Purple - 責任感 */}
              <span className="rounded-full bg-[#E9D5FF] px-3 py-1.5 text-xs font-medium text-[#6B21A8]">
                家族を守りたい責任感
              </span>
              {/* Orange - 疲労 */}
              <span className="rounded-full bg-[#FED7AA] px-3 py-1.5 text-xs font-medium text-[#9A3412]">
                評価されない努力への疲労
              </span>
              {/* Blue - 決意 */}
              <span className="rounded-full bg-[#BFDBFE] px-3 py-1.5 text-xs font-medium text-[#1E3A8A]">
                もう一度、自分の力を試したい静かな決意
              </span>
            </div>
          </div>

          {/* Section 3: Today's Advice - Updated text */}
          <div className="pl-2">
            <h3 className="mb-3 text-sm font-semibold text-[#374151]">今日のひと言アドバイス</h3>
            <div className="rounded-xl bg-[#E8F2FF] p-4">
              <p className="text-sm leading-relaxed text-[#1E40AF]">
                今日は10分だけ、『次の仕事で必ず叶えたい3つの条件』を書き出してみてください。迷いが整理され、方向性が一段クリアになります。
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Recommended Directions */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-[#1F2937]">おすすめの方向性</h2>
          <div className="space-y-2">
            <div className="rounded-xl bg-[#F9FAFB] p-3">
              <div className="mb-1 font-medium text-[#1F2937]">PdM（プロダクトマネージャー）</div>
              <p className="text-xs text-[#6B7280]">裁量 × 成長が高く相性◎</p>
            </div>
            <div className="rounded-xl bg-[#F9FAFB] p-3">
              <div className="mb-1 font-medium text-[#1F2937]">BizDev（事業開発）</div>
              <p className="text-xs text-[#6B7280]">行動力と挑戦志向と適合</p>
            </div>
            <div className="rounded-xl bg-[#F9FAFB] p-3">
              <div className="mb-1 font-medium text-[#1F2937]">AI SaaS企業</div>
              <p className="text-xs text-[#6B7280]">価値観と実績から親和性が高い</p>
            </div>
          </div>
        </div>

        {/* Section 5: Fit Analysis with Current Applications */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-[#1F2937]">応募中の企業とのフィット度</h2>
          <div className="space-y-3">
            {ongoingApps.slice(0, 5).map((app, index) => {
              // Generate fit scores based on position and step progress
              const baseScore = 60 + Math.random() * 30
              const progressBonus = (app.stepCurrent / app.stepTotal) * 10
              const fitScore = Math.min(95, Math.round(baseScore + progressBonus))

              return (
                <div key={app.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#374151]">{app.company}</span>
                    <span className="text-sm font-semibold text-[#3B82F6]">{fitScore}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                      style={{ width: `${fitScore}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Section 6: Recommended Actions */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-base font-semibold text-[#1F2937]">今週やるべきこと</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span className="text-sm text-[#374151]">志望動機の一貫性チェック</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span className="text-sm text-[#374151]">スキル棚卸しの更新</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-[#E5E7EB] p-3">
              <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
              <span className="text-sm text-[#374151]">ケース問題の練習（1回）</span>
            </div>
          </div>
        </div>

        {/* Section 7: Today's Question CTA */}
        <Link
          href="/daily-question"
          className="block rounded-2xl bg-[#E9F2FF] p-4 shadow-sm transition-colors hover:bg-[#DDE9FF]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧠</span>
              <span className="font-medium text-[#1F2937]">今日の1問を回答する</span>
            </div>
            <svg className="h-5 w-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </main>
    </div>
  )
}
