'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ToroComposer } from '@/app/components/toro/ToroComposer'

interface WriteClientProps {
  isAuthenticated: boolean
}

export default function WriteClient({ isAuthenticated }: WriteClientProps) {
  const [initialContent, setInitialContent] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('toro_draft')
    if (draft) {
      setInitialContent(draft)
    }
    setIsLoaded(true)
  }, [])

  const handleSaved = () => {
    localStorage.removeItem('toro_draft')
    router.push('/past')
    router.refresh()
  }

  const handleContentChange = (content: string) => {
    localStorage.setItem('toro_draft', content)
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-black/20" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ToroComposer
        isAuthenticated={isAuthenticated}
        defaultValue={initialContent}
        onSaved={handleSaved}
        onContentChange={handleContentChange}
        context={{ type: 'hitokoto' }}
      />
      
      <div className="flex justify-start mt-8">
        <button 
          onClick={() => router.push('/')}
          className="text-xs text-black/20 hover:text-black/40 transition-colors"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
