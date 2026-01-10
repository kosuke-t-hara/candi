import Image from "next/image"

interface EmptyApplicationStateProps {
  onAddClick: () => void
}

export function EmptyApplicationState({ onAddClick }: EmptyApplicationStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-[14px] bg-white shadow-sm border border-[#E5E7EB]">
      <div className="relative w-40 h-40 md:w-60 md:h-60 mb-6">
        <Image
          src="/candi/empty_application.png"
          alt="進行中の応募はありません"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">
        進行中の応募はありません
      </h3>
      <p className="text-sm text-[#6B7280] mb-8">
        応募を追加すると、選考の流れをまとめて管理できます
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-black hover:shadow-lg active:scale-95"
      >
        <span className="text-lg leading-none pb-0.5">+</span>
        <span>応募を追加</span>
      </button>
    </div>
  )
}
