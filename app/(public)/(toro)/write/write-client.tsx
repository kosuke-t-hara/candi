'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createToroEntry } from '@/app/actions/toro'
import { Loader2 } from 'lucide-react'

interface WriteClientProps {
  isAuthenticated: boolean
}

export default function WriteClient({ isAuthenticated }: WriteClientProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const router = useRouter()

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('toro_draft')
    if (draft) {
      setContent(draft)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('toro_draft', content)
    }
  }, [content, isLoaded])

  const handleSave = async () => {
    if (!content.trim()) return

    if (!isAuthenticated) {
      // Save draft and redirect to login
      localStorage.setItem('toro_draft', content)
      router.push('/login?returnUrl=/write')
      return
    }

    setIsSaving(true)
    try {
      await createToroEntry(content)
      localStorage.removeItem('toro_draft')
      router.push('/past')
      router.refresh()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('保存に失敗しました。')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-black/20" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-widest text-black/70">書く</h1>
        <button
          onClick={handleSave}
          disabled={isSaving || !content.trim()}
          className="px-6 py-2 text-sm font-light tracking-widest border border-black/10 rounded-full hover:border-black/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : '保存'}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今の気持ちを、そのままに。"
        className="w-full h-[60vh] bg-transparent border-none focus:ring-0 text-lg font-light leading-relaxed placeholder:text-black/10 resize-none outline-none"
        autoFocus
      />
      
      <div className="flex justify-start">
        <button 
          onClick={() => router.back()}
          className="text-xs text-black/20 hover:text-black/40 transition-colors"
        >
          戻る
        </button>
      </div>
    </div>
  )
}
