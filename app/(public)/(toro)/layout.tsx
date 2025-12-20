import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Toro",
  description: "書かなくても、ここにいていいです。",
}

export default function ToroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-[#4a4a4a] selection:bg-[#e2e2e2]">
      <main className="max-w-screen-md mx-auto px-6 py-12 md:py-24">
        {children}
      </main>
    </div>
  )
}
