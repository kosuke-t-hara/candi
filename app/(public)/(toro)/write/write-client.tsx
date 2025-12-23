'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createToroEntry } from '@/app/actions/toro'
import { Loader2, Mic, MicOff } from 'lucide-react'
import { useSpeechToTextJa } from '@/app/hooks/useSpeechToTextJa'

interface WriteClientProps {
  isAuthenticated: boolean
}

export default function WriteClient({ isAuthenticated }: WriteClientProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const router = useRouter()
  const contentRef = useRef('') // textarea の最新値を常に保持
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
        // 簡単な整形：前の文字が改行でなく、今回が改行でないなら、スペースを入れるかどうか
        // 英数字連携ならスペースを入れるなどのロジックはここで必要なら書く
        // 今回はシンプルに結合、ただし改行以外での結合でスペースを入れるかはユーザーの好み次第だが
        // 日本語メインならそのまま結合で良い。
        
        if (!text) return prev;
        
        shouldAutoScrollRef.current = true
        
        // 末尾の改行コードの整理などは必要に応じて
        return prev + text;
      });
    }
  })

  // 音声入力で追記された場合のみ、自動で末尾までスクロール・フォーカス移動
  useEffect(() => {
    if (shouldAutoScrollRef.current && textareaRef.current) {
      const ta = textareaRef.current
      ta.scrollTop = ta.scrollHeight
      
      // カーソルも末尾に移動させる（ユーザー要望：少なくともスクロール、できればカーソル移動）
      // ただしフォーカスが当たっていない時はフォーカスを奪うべきか？
      // 「テキストエリアにフォーカスしてkeydownを押さないと」という不満解消のため、
      // 軽くフォーカス＆移動を行っておくのが親切。
      // ※編集中に割り込むと邪魔だが、音声入力モード中なので許容範囲と想定。
      // ta.focus() // フォーカスまで奪うとキーボード閉じるかもなので一旦スクロールのみにするか？
      // いや、PC操作前提ならフォーカス移動しても良いが、スマホだとキーボードが出る。
      // ユーザーは「カーソルをそこに持っていける？」と言っている。
      // ここでは selectionStart/End を操作するだけに留め、focus() はしないでおく（見えればOK）
      
      // ta.setSelectionRange(ta.value.length, ta.value.length)
      
      shouldAutoScrollRef.current = false
    }
  }, [content])

  // Load draft from localStorage on mount
  useEffect(() => {
    const draft = localStorage.getItem('toro_draft')
    if (draft) {
      setContent(draft)
      // hook 側の初期値セットは不要になったので削除
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever content changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('toro_draft', content)
    }
  }, [content, isLoaded])

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
      setIsSaving(false)
    } finally {
      // router.push の遷移中もローダーを表示し続ける
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setContent(val)
    // setFinalText は削除
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-black/20" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-widest text-black/70">いまのきもち</h1>
        
        <div className="flex items-center gap-6">
          {error && (
            <span className="text-xs text-red-400/60 font-light animate-in fade-in duration-500">
              {error === 'not-allowed' ? 'マイクの使用が許可されていません' : '音声認識エラーが発生しました'}
            </span>
          )}
          
          <button
            onClick={toggleRecording}
            className={`relative p-2 rounded-full transition-all duration-500 ${
              isListening 
                ? 'text-black/60 bg-black/5' 
                : 'text-black/20 hover:text-black/40 hover:bg-black/5'
            }`}
            title={isListening ? "停止" : "音声で入力"}
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
            className="px-6 py-2 text-sm font-light tracking-widest border border-black/10 rounded-full hover:border-black/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-black/40" /> : '保存'}
          </button>
        </div>
      </div>

      <div className="relative group min-h-[60vh]">
        {isListening && (
          <div className="absolute top-0 right-0 -mt-6 mr-2">
            <span className="text-[10px] font-light tracking-[0.2em] text-black/20 animate-pulse">
              聴いています...
            </span>
          </div>
        )}
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleTextChange}
          placeholder="今の気持ちを、そのままに。"
          className="w-full h-full min-h-[50vh] bg-transparent border-none focus:ring-0 text-lg font-light leading-relaxed placeholder:text-black/10 resize-none outline-none overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          autoFocus
        />

        {/* Interim Text (未確定文字) をテキストエリアの下に表示 */}
        {interimText && (
          <div className="mt-2 text-lg font-light leading-relaxed tracking-wide text-black/30 italic opacity-60 animate-in fade-in duration-300">
            {interimText}
          </div>
        )}
      </div>
      
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

