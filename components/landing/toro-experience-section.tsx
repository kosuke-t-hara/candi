'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Sparkles, Wand, ArrowRight } from 'lucide-react'
import { generateQuestion } from '@/app/actions/ai'
import { useSpeechToTextJa } from '@/app/hooks/useSpeechToTextJa'
import { gaEvent } from '@/lib/ga'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ToroExperienceSection() {
  const router = useRouter()
  // No collapsed state anymore
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shouldAutoScrollRef = useRef(false)
  const [hasStartedInput, setHasStartedInput] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const viewFiredRef = useRef(false)

  // Intersection Observer for lp_toro_view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !viewFiredRef.current) {
          gaEvent('lp_toro_view')
          viewFiredRef.current = true
        }
      },
      { threshold: 0.3 }
    )
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    return () => observer.disconnect()
  }, [])

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
        
        // Track input if not already tracked
        if (!hasStartedInput && newContent.length > 0) {
            setHasStartedInput(true)
            gaEvent('toro_trial_input')
        }
        return newContent;
      });
    }
  })

  // Auto-scroll handling
  useEffect(() => {
    if (shouldAutoScrollRef.current && textareaRef.current) {
      const ta = textareaRef.current
      ta.scrollTop = ta.scrollHeight
      shouldAutoScrollRef.current = false
    }
  }, [content])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    if (!hasStartedInput && e.target.value.length > 0) {
      setHasStartedInput(true)
      gaEvent('toro_trial_input')
    }
  }

  const toggleRecording = () => {
    if (isListening) {
      stop()
    } else {
      start()
      // Track input start on mic click too if likely to speak
      if (!hasStartedInput) {
        setHasStartedInput(true)
        gaEvent('toro_trial_input')
      }
    }
  }

  const handleGenerateValues = async () => {
    if (!content.trim() || isGenerating) return

    setIsGenerating(true)
    gaEvent('toro_trial_ai_run')
    setQuestion(null) 

    try {
      const generatedQuestion = await generateQuestion(content)
      setQuestion(generatedQuestion)
    } catch (error) {
      console.error('Failed to generate question:', error)
      toast.error('問いを生成できませんでした。もう一度お試しください')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = () => {
    gaEvent('toro_trial_login_click')
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('toro_draft', content)
      if (question) {
           localStorage.setItem('toro_draft_question', question)
      }
    }
    router.push('/login?returnUrl=/write')
  }

  return (
    <section ref={sectionRef} className="bg-background px-5 py-16 md:px-8 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-3xl space-y-4">
        
        {/* Section Header */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            AIの問いを体験してみよう。
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            好きなことを書いていいです。
          </p>
        </div>

        {/* The "Card" UI - Always Visible */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-black/5 shadow-sm p-6 md:p-8">
            {/* Input Area */}
            <div className="relative group min-h-[60px] mb-6">
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextChange}
                    disabled={isGenerating || !!question}
                    placeholder="今日いちばん迷っていることは？"
                    className="w-full h-full min-h-[60px] bg-transparent border-none p-0 text-lg font-light leading-relaxed placeholder:text-muted-foreground/40 resize-none outline-none focus:ring-0 disabled:opacity-50"
                />
                
                {interimText && (
                    <div className="absolute inset-0 pointer-events-none text-lg font-light leading-relaxed tracking-wide text-foreground/30 italic">
                        <span className="invisible">{content}</span>
                        <span>{interimText}</span>
                    </div>
                )}
            </div>

            {/* Controls & Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-muted/20">
                <div className="flex items-center gap-4 order-1 sm:order-2 self-end sm:self-auto">
                    {!question && (
                        <button
                            onClick={toggleRecording}
                            className={`flex items-center justify-center p-3 rounded-full transition-all duration-300 ${
                                isListening 
                                ? 'bg-red-50 text-red-500 shadow-inner' 
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                            title={isListening ? "停止" : "音声で入力"}
                        >
                            {isListening ? <Mic className="w-5 h-5 animate-pulse text-red-500" /> : <Mic className="w-5 h-5" />}
                        </button>
                    )}

                    {!question && (
                        <button
                            onClick={handleGenerateValues}
                            disabled={!content.trim() || isGenerating}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isGenerating ? <LoadingSpinner size={16} /> : <Sparkles className="w-4 h-4" />}
                            <span>問いを立ててみる</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Result Display */}
            <AnimatePresence>
                {question && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                        className="border-t-2 border-dashed border-muted/50 overflow-hidden"
                    >
                        <div className="pt-8 space-y-8">
                            <div className="space-y-4">
                                <div className="text-xs font-bold tracking-widest uppercase text-center text-primary/60">
                                    AIからの問い
                                </div>
                                <div className="border-t border-b border-primary/10 py-6 text-center">
                                    <p className="text-xl md:text-2xl font-serif text-foreground leading-relaxed">
                                        {question}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-4 text-center bg-secondary/20 rounded-2xl p-6">
                                <p className="text-sm text-foreground/80 font-medium">
                                    この問いやあなたの思考を残すには、ログインが必要です。
                                </p>
                                <button
                                    onClick={handleSaveAndContinue}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-3 font-medium transition-transform hover:scale-105 shadow-lg"
                                >
                                    <span>残して続ける</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                                
                                <button
                                    onClick={handleGenerateValues}
                                    disabled={isGenerating}
                                    className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors mt-2 underline underline-offset-4"
                                >
                                    もう一度AIで問いを立てる
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
