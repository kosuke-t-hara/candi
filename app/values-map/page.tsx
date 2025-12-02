"use client"

import { Header } from "@/components/header"
import { ChevronLeft, MoreVertical } from "lucide-react"
import Link from "next/link"

export default function ValuesMapPage() {
  // Mock data for radar chart
  const values = [
    { label: "裁量", value: 85 },
    { label: "成長", value: 75 },
    { label: "安定", value: 35 },
    { label: "人間関係", value: 60 },
    { label: "WLB", value: 50 },
    { label: "報酬", value: 55 },
  ]

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      <Header />

      {/* Sub header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <h2 className="text-lg font-semibold text-[#1A1A1A]">価値観マップ</h2>
            <button className="text-gray-600 hover:text-gray-900">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 space-y-4">
        {/* Section 1: Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 border-l-4 border-[#3B82F6]">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-2 tracking-[0.25px]">あなたの価値観の傾向</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            あなたは<span className="font-medium text-[#1A1A1A]">「成長志向 × 裁量重視」</span>
            の傾向があります。自由に動ける環境で新しいことに挑戦することで、最もパフォーマンスを発揮しやすいタイプです。
          </p>
        </div>

        {/* Section 2: Radar Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-4 tracking-[0.25px]">価値観の分布</h3>
          <div className="flex justify-center">
            <RadarChart values={values} />
          </div>
        </div>

        {/* Section 3: Axis Comments */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h3 className="text-base font-semibold text-[#1A1A1A] mb-4 tracking-[0.25px]">各項目の詳細</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">裁量</span>
              <span className="text-sm font-medium text-[#1A1A1A]">高め</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">成長</span>
              <span className="text-sm font-medium text-[#1A1A1A]">中高</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">安定</span>
              <span className="text-sm font-medium text-[#1A1A1A]">低め</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">人間関係</span>
              <span className="text-sm font-medium text-[#1A1A1A]">中</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">ワークライフバランス</span>
              <span className="text-sm font-medium text-[#1A1A1A]">中</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">報酬</span>
              <span className="text-sm font-medium text-[#1A1A1A]">中</span>
            </div>
          </div>
        </div>

        {/* Section 4: Additional Questions CTA */}
        <Link
          href="/ai-hearing"
          className="block w-full bg-[#E3F0FF] hover:bg-[#D1E7FF] transition-colors rounded-full py-3.5 text-center text-sm font-medium text-[#2F80ED] shadow-sm"
        >
          精度を高める（質問に答える）
        </Link>
      </div>
    </div>
  )
}

// Simple SVG Radar Chart Component
function RadarChart({ values }: { values: { label: string; value: number }[] }) {
  const size = 280
  const center = size / 2
  const maxRadius = 100
  const levels = 5
  const angleStep = (2 * Math.PI) / values.length

  // Calculate polygon points for data
  const dataPoints = values
    .map((val, i) => {
      const angle = i * angleStep - Math.PI / 2
      const radius = (val.value / 100) * maxRadius
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return `${x},${y}`
    })
    .join(" ")

  // Calculate grid lines
  const gridLevels = Array.from({ length: levels }, (_, i) => {
    const radius = ((i + 1) / levels) * maxRadius
    return values.map((_, idx) => {
      const angle = idx * angleStep - Math.PI / 2
      const x = center + radius * Math.cos(angle)
      const y = center + radius * Math.sin(angle)
      return { x, y }
    })
  })

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* Grid circles */}
      {gridLevels.map((_, i) => (
        <circle
          key={i}
          cx={center}
          cy={center}
          r={((i + 1) / levels) * maxRadius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {values.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2
        const x = center + maxRadius * Math.cos(angle)
        const y = center + maxRadius * Math.sin(angle)
        return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="1" />
      })}

      {/* Data polygon */}
      <polygon points={dataPoints} fill="#3B82F6" fillOpacity="0.25" stroke="#3B82F6" strokeWidth="2" />

      {/* Data points */}
      {values.map((val, i) => {
        const angle = i * angleStep - Math.PI / 2
        const radius = (val.value / 100) * maxRadius
        const x = center + radius * Math.cos(angle)
        const y = center + radius * Math.sin(angle)
        return <circle key={i} cx={x} cy={y} r="4" fill="#3B82F6" />
      })}

      {/* Labels */}
      {values.map((val, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = maxRadius + 25
        const x = center + labelRadius * Math.cos(angle)
        const y = center + labelRadius * Math.sin(angle)
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-600 font-medium"
          >
            {val.label}
          </text>
        )
      })}
    </svg>
  )
}
