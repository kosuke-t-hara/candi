'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createToroEntry } from '@/app/actions/toro'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { LoadingOverlay } from '@/components/ui/loading-overlay'
import { Mic } from 'lucide-react'
import { useSpeechToTextJa } from '@/app/hooks/useSpeechToTextJa'

interface ToroComposerProps {
  isAuthenticated: boolean
  defaultValue?: string
  onSaved?: () => void
  onContentChange?: (content: string) => void
  context?: any
  className?: string
  placeholder?: string
}

export function ToroComposer({ 
  isAuthenticated, 
  defaultValue = '', 
  onSaved, 
  onContentChange,
  context,
  className = '',
  placeholder = "今の気持ちを、そのままに。"
}: ToroComposerProps) {
  const [content, setContent] = useState(defaultValue)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const router = useRouter()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shouldAutoScrollRef = useRef(false)

  const {
    interimText,
    isListening,
    error,
    start,
    stop,
  } = useSpeechToTextJa({
    pauseMs: 1100,
    autoLineBreak: true,
    smartNormalize: true,
    onFinal: (text) => {
      setContent((prev) => {
        if (!text) return prev;
        shouldAutoScrollRef.current = true
        const newContent = prev + text;
        onContentChange?.(newContent)
        return newContent;
      });
    }
  })

  // 音声入力で追記された場合のみ、自動で末尾までスクロール
  useEffect(() => {
    if (shouldAutoScrollRef.current && textareaRef.current) {
      const ta = textareaRef.current
      ta.scrollTop = ta.scrollHeight
      shouldAutoScrollRef.current = false
    }
  }, [content])

  // 初期ロード完了 (Hydration mismatch防ぐため、またはlocalStorage読み込み待ち等)
  // 今回はlocalStorage読み込みは親(write-client)でやるか、ここでやるか？
  // 要件: "共通UI" なので、localStorage('toro_draft') は `/write` 特有かもしれない。
  // しかし "既存の挙動を壊さない" ため、このコンポーネント内で draft saved/load をやるオプションがあると良い。
  // いったん、汎用性を考え、localStorage logicは `write-client.tsx` 側に残すか、
  // あるいは `mode="page" | "embedded"` で分岐するか。
  // ここでは `defaultValue` で制御することにして、localStorageロジックは親に任せるのが綺麗だが、
  // リファクタを最小にするならここに持たせるのが楽。
  // しかし Candi 埋め込み時に勝手に `toro_draft` 読み込まれても困る。
  // よって `loadFromLocalStorage` のような prop を作るか、親で制御する。
  // ここでは「親で制御する」方針で実装する。
  // `write-client.tsx` が localStorage から読んで `defaultValue` に渡す形にする。
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const toggleRecording = () => {
    if (isListening) {
      stop()
    } else {
      start()
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return

    if (isListening) {
      stop()
    }

    if (!isAuthenticated) {
      // 未ログイン時の挙動。
      // Embed版でも未ログインなら保存できないのが普通だが、
      // `/write` では localStorage に保存して login へ飛ばす。
      // この挙動をどう共通化するか？
      // ここではシンプルに `onSaveAttemptFailed` のようなものを呼ぶか、
      // 呼び出し元で制御すべきだが、
      // 既存ロジックをここに移植するなら、router.push もここにあるべきか。
      // context がある(=Embed)場合は、勝手に飛ばれると困るかも。
      // context がなければ `/write` 用とみなして飛ばすロジックを入れる。
      if (!context) {
        localStorage.setItem('toro_draft', content)
        router.push('/login?returnUrl=/write')
      } else {
         // Embed版での未ログイン対応 (とりあえずアラートか何もしない)
         alert('ログインが必要です。')
      }
      return
    }

    setIsSaving(true)
    try {
      // @ts-ignore: createToroEntry signature will be updated later
      await createToroEntry(content, context)
      
      // 保存成功
      setContent('')
      if (onSaved) {
        onSaved()
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('保存に失敗しました。')
      setIsSaving(false)
    } finally {
       // Embedの場合は setIsSaving(false) したいが、
       // `/write` の場合は画面遷移するので false に戻さなくてもいいかもだが、一応戻す
       if (context || onSaved) {
         setIsSaving(false)
       }
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setContent(val)
    onContentChange?.(val)
  }

  if (!isLoaded && typeof window !== 'undefined' && !defaultValue) {
      // Loading state if needed, though mostly handled by parent
  }

  return (
    <div className={`space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 ${className}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-widest text-black/70"></h1>
        
        <div className="flex items-center gap-6">
          {error && (
            <span className="text-xs text-red-400/60 font-light animate-in fade-in duration-500">
              {error === 'not-allowed' ? 'マイクの使用が許可されていません' : '音声認識エラーが発生しました'}
            </span>
          )}
          
          <button
            onClick={toggleRecording}
            className={`relative flex items-center justify-center p-2 rounded-full transition-all duration-500 ${
              isListening 
                ? 'text-black/60 bg-black/5' 
                : 'text-black/20 hover:text-black/40 hover:bg-black/5'
            }`}
            title={isListening ? "停止" : "音声で入力を開始"}
            type="button"
          >
            {isListening ? (
              <>
                <Mic className="w-5 h-5 text-red-400/60" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400/40 rounded-full animate-pulse" />
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="px-6 py-2 text-sm font-light tracking-widest border border-black/10 rounded-full hover:border-black/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
            type="button"
          >
            {isSaving ? <LoadingSpinner size={16} /> : '残す'}
          </button>
        </div>
      </div>

      <div className="relative group min-h-[60vh]">
        {/* ... existing textarea ... */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          placeholder={placeholder}
          className="w-full h-full min-h-[50vh] bg-black/[0.01] border border-black/5 rounded-2xl p-6 focus:ring-0 focus:border-black/10 text-lg font-light leading-relaxed placeholder:text-black/10 resize-none outline-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] transition-colors duration-300"
          autoFocus={!context}
        />
        {/* Interim Text */}
        {interimText && (
          <div className="mt-2 text-lg font-light leading-relaxed tracking-wide text-black/30 italic opacity-60 animate-in fade-in duration-300">
            {interimText}
          </div>
        )}
      </div>
      
      <LoadingOverlay isVisible={isSaving} />
    </div>
  )
}
