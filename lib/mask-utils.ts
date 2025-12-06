import type { SourceType } from "./mock-data"

export const getDisplayCompanyName = (company: string, isMasked: boolean): string => {
  if (!isMasked) return company
  const first = company.trim().charAt(0)
  return `${first}社`
}

export const getDisplaySourceLabel = (sourceType: SourceType, sourceLabel: string, isMasked: boolean): string => {
  if (!isMasked) return sourceLabel
  if (sourceType === "agent") {
    return "＊＊＊"
  }
  return sourceLabel
}

export const getSourceTypeLabel = (sourceType: SourceType): string => {
  switch (sourceType) {
    case "agent":
      return "エージェント"
    case "direct":
      return "ダイレクト"
    case "self":
      return "自己応募"
    case "referral":
      return "リファラル"
    case "other":
      return "その他"
  }
}

export const getSourceTypeBadgeClasses = (sourceType: SourceType): string => {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
  switch (sourceType) {
    case "agent":
      return `${base} bg-blue-100 text-blue-800`
    case "direct":
      return `${base} bg-green-100 text-green-800`
    case "self":
      return `${base} bg-gray-100 text-gray-800`
    case "referral":
      return `${base} bg-purple-100 text-purple-800`
    case "other":
      return `${base} bg-gray-100 text-gray-800`
  }
}
