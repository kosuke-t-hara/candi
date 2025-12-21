'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createToroEntry } from '@/app/actions/toro'
import { Loader2, Mic, MicOff } from 'lucide-react'

// Web Speech API interfaces for TypeScript
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
  onstart: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface WriteClientProps {
  isAuthenticated: boolean
}

export default function WriteClient({ isAuthenticated }: WriteClientProps) {
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const router = useRouter()
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const processedIndexRef = useRef(0)
  const isComponentMounted = useRef(true)

  // Initialize SpeechRecognition
  useEffect(() => {
    isComponentMounted.current = true
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = 'ja-JP'

      recognition.onstart = () => {
        setIsRecording(true)
        setErrorMsg(null)
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let newTranscript = ''
        for (let i = processedIndexRef.current; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript
          }
        }
        processedIndexRef.current = event.results.length

        if (newTranscript) {
          setContent(prev => {
            const separator = prev && !prev.endsWith('\n') && !prev.endsWith(' ') ? ' ' : ''
            return prev + separator + newTranscript
          })
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // "network" error can happen when stopping or due to transient internet issues.
        // We suppress it if it's a minor transient issue to avoid flickering error messages.
        if (event.error === 'network') {
          console.warn('Speech recognition network warning:', event.message)
          return
        }

        console.error('Speech recognition error:', event.error)
        if (event.error === 'not-allowed') {
          setErrorMsg('マイクの利用が許可されていません')
        } else if (event.error === 'no-speech') {
          // Silent failure for no-speech is often better UX than showing an error
          return
        } else {
          setErrorMsg('音声認識でエラーが発生しました')
        }
        setIsRecording(false)
      }

      recognition.onend = () => {
        if (isComponentMounted.current) {
          setIsRecording(false)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      isComponentMounted.current = false
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

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

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMsg('このブラウザは音声入力に対応していません')
      return
    }

    if (isRecording) {
      recognitionRef.current.stop()
    } else {
      setErrorMsg(null)
      processedIndexRef.current = 0
      try {
        recognitionRef.current.start()
      } catch (e) {
        console.error('Failed to start recognition:', e)
        // Handle cases where recognition is already starting/started
      }
    }
  }

  const handleSave = async () => {
    if (!content.trim()) return

    if (isRecording) {
      recognitionRef.current?.stop()
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
    } finally {
      setIsSaving(true) // Keep loader visible during navigation
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
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light tracking-widest text-black/70">書く</h1>
        
        <div className="flex items-center gap-6">
          {errorMsg && (
            <span className="text-xs text-red-400/60 font-light animate-in fade-in duration-500">
              {errorMsg}
            </span>
          )}
          
          <button
            onClick={toggleRecording}
            className={`relative p-2 rounded-full transition-all duration-500 ${
              isRecording 
                ? 'text-black/60 bg-black/5' 
                : 'text-black/20 hover:text-black/40 hover:bg-black/5'
            }`}
            title={isRecording ? "停止" : "音声で入力"}
          >
            {isRecording ? (
              <>
                <Mic className="w-5 h-5" />
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

      <div className="relative group">
        {isRecording && (
          <div className="absolute top-0 right-0 -mt-6 mr-2">
            <span className="text-[10px] font-light tracking-[0.2em] text-black/20 animate-pulse">
              聴いています...
            </span>
          </div>
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今の気持ちを、そのままに。"
          className="w-full h-[60vh] bg-transparent border-none focus:ring-0 text-lg font-light leading-relaxed placeholder:text-black/10 resize-none outline-none"
          autoFocus
        />
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

