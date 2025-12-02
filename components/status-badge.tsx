interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "こっちボール":
        return "bg-yellow-100 text-yellow-800"
      case "企業ボール":
        return "bg-blue-500 text-white"
      case "確定":
        return "bg-gray-200 text-gray-600"
      case "調整中":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-200 text-gray-600"
    }
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyles()}`}>
      {status}
    </span>
  )
}
