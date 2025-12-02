"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

type Step = 1 | 2 | 3 | 4

type ValueOption =
  | "裁量・自由度"
  | "成長・挑戦"
  | "安定"
  | "人間関係"
  | "ワークライフバランス"
  | "社会的意義"
  | "報酬の高さ"
  | "その他"

export default function AIHearingPage() {
  const [step, setStep] = useState<Step>(1)
  const [selectedValue, setSelectedValue] = useState<ValueOption | null>(null)
  const [customValue, setCustomValue] = useState("")
  const [deepDiveAnswer, setDeepDiveAnswer] = useState("")

  const valueOptions: ValueOption[] = [
    "裁量・自由度",
    "成長・挑戦",
    "安定",
    "人間関係",
    "ワークライフバランス",
    "社会的意義",
    "報酬の高さ",
    "その他",
  ]

  const getAIComment = (value: ValueOption | null) => {
    if (!value) return ""
    switch (value) {
      case "裁量・自由度":
        return "あなたは裁量を重視する傾向がありますね"
      case "成長・挑戦":
        return "あなたは成長や挑戦を求める傾向がありますね"
      case "安定":
        return "あなたは安定を重視する傾向がありますね"
      case "人間関係":
        return "あなたは人間関係を大切にする傾向がありますね"
      case "ワークライフバランス":
        return "あなたはワークライフバランスを重視する傾向がありますね"
      case "社会的意義":
        return "あなたは社会的意義を求める傾向がありますね"
      case "報酬の高さ":
        return "あなたは報酬を重視する傾向がありますね"
      case "その他":
        return "あなたの価値観について教えてください"
    }
  }

  const getDeepDiveQuestion = (value: ValueOption | null) => {
    if (!value) return ""
    switch (value) {
      case "裁量・自由度":
        return "自由に動けてうまくいった経験はありますか？"
      case "成長・挑戦":
        return "挑戦して成長を実感した経験はありますか？"
      case "安定":
        return "安定した環境で力を発揮できた経験はありますか？"
      case "人間関係":
        return "良好な人間関係が成果につながった経験はありますか？"
      case "ワークライフバランス":
        return "バランスの取れた働き方で成果を出せた経験はありますか？"
      case "社会的意義":
        return "社会に貢献できたと感じた経験はありますか？"
      case "報酬の高さ":
        return "報酬が高いことでモチベーションが上がった経験はありますか？"
      case "その他":
        return "その価値観が大切だと感じるようになったきっかけは？"
    }
  }

  const generateValueMemo = (value: ValueOption | null, answer: string) => {
    const memoItems = []

    if (value === "裁量・自由度") {
      memoItems.push("裁量があるとパフォーマンスを発揮しやすい")
      memoItems.push("自主的に動ける環境を好む")
      if (answer) memoItems.push("過去に自由度の高い環境で成功体験がある")
      memoItems.push("マイクロマネジメントを避けたい")
    } else if (value === "成長・挑戦") {
      memoItems.push("新しいことに挑戦することを好む")
      memoItems.push("成長実感を重視する")
      if (answer) memoItems.push("挑戦を通じて成長してきた経験がある")
      memoItems.push("変化を恐れない")
    } else if (value === "安定") {
      memoItems.push("安定した環境でパフォーマンスを発揮しやすい")
      memoItems.push("予測可能性を重視する")
      if (answer) memoItems.push("安定した環境で成果を出してきた")
      memoItems.push("長期的な視点で判断する傾向")
    } else {
      memoItems.push(`${value || "あなたの価値観"}を重視する傾向がある`)
      if (answer) memoItems.push("過去の経験から価値観が形成されている")
      memoItems.push("納得感を大切にする")
    }

    return memoItems
  }

  const handleNext = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && selectedValue) {
      setStep(3)
    } else if (step === 3) {
      setStep(4)
    }
  }

  const handleSkip = () => {
    setStep(4)
  }

  const handleFinish = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />
      <main className="mx-auto max-w-md px-4 py-8">
        {step === 1 && (
          <div className="flex min-h-[70vh] flex-col items-center justify-center">
            <div className="w-full rounded-2xl bg-white p-8 shadow-sm">
              <div className="mb-6 flex justify-center">
                <div className="text-6xl">🎤</div>
              </div>
              <h1 className="mb-4 text-center text-2xl font-bold text-[#1A1A1A] tracking-[0.25px]">
                あなたの価値観を整理しませんか？
              </h1>
              <p className="mb-8 text-center text-sm leading-relaxed text-[#6B7280] tracking-[0.25px]">
                キャリア判断や企業選びをもっと楽にするための、
                <br />
                3つの簡単な質問です。（約1分）
              </p>
              <Button onClick={handleNext} className="w-full bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90">
                AIヒアリングを始める
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-6 text-xl font-bold text-[#1A1A1A] tracking-[0.25px]">
              仕事で大事にしたいものは何ですか？
            </h2>
            <div className="space-y-3">
              {valueOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedValue(option)}
                  className={`w-full rounded-2xl bg-white p-4 text-left shadow-sm transition-all hover:shadow-md ${
                    selectedValue === option ? "ring-2 ring-[#2F80ED]" : ""
                  }`}
                >
                  <span className="text-sm font-medium text-[#1A1A1A] tracking-[0.25px]">{option}</span>
                </button>
              ))}
              {selectedValue === "その他" && (
                <div className="mt-4">
                  <Input
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="具体的に入力してください"
                    className="rounded-xl border-[#E5E7EB] bg-white"
                  />
                </div>
              )}
            </div>
            <Button
              onClick={handleNext}
              disabled={!selectedValue}
              className="mt-6 w-full bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90 disabled:opacity-50"
            >
              次へ
            </Button>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-sm text-[#6B7280] tracking-[0.25px]">{getAIComment(selectedValue)}</p>
            </div>
            <h2 className="mb-4 text-lg font-semibold text-[#1A1A1A] tracking-[0.25px]">
              {getDeepDiveQuestion(selectedValue)}
            </h2>
            <Textarea
              value={deepDiveAnswer}
              onChange={(e) => setDeepDiveAnswer(e.target.value)}
              placeholder="自由に入力してください（任意）"
              className="min-h-[120px] rounded-2xl border-[#E5E7EB] bg-white"
            />
            <div className="mt-6 flex gap-3">
              <Button onClick={handleSkip} variant="ghost" className="flex-1 text-[#6B7280]">
                スキップ
              </Button>
              <Button onClick={handleNext} className="flex-1 bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90">
                次へ
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1A1A1A] tracking-[0.25px]">あなたの価値観メモ</h2>
              <button className="text-[#6B7280] hover:text-[#1A1A1A]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
            </div>
            <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <ul className="space-y-3">
                {generateValueMemo(selectedValue, deepDiveAnswer).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#2F80ED]" />
                    <span className="text-sm text-[#1A1A1A] tracking-[0.25px]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button onClick={handleFinish} className="w-full bg-[#2F80ED] text-white hover:bg-[#2F80ED]/90">
              完了
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
