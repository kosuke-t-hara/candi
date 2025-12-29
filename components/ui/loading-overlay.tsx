import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isVisible?: boolean
}

export function LoadingOverlay({ isVisible = true, className, ...props }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200",
        className
      )} 
      {...props}
    >
      <LoadingSpinner size={48} />
    </div>
  )
}
