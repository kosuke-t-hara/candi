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

export function ToroExperienceSection() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [question, setQuestion] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const shouldAutoScrollRef = useRef(false)
  const [hasStartedInput, setHasStartedInput] = useState(false)

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
        return newContent;
      });
    }
  })

  // Auto-scroll for speech input
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
      gaEvent('toro_lp_input_start')
    }
  }

  const toggleRecording = () => {
    if (isListening) {
      stop()
    } else {
      start()
      if (!hasStartedInput) {
        setHasStartedInput(true)
        gaEvent('toro_lp_input_start')
      }
    }
  }

  const handleGenerateValues = async () => {
    if (!content.trim() || isGenerating) return

    setIsGenerating(true)
    gaEvent('toro_lp_ai_click')

    try {
      const generatedQuestion = await generateQuestion(content)
      setQuestion(generatedQuestion)
      gaEvent('toro_lp_ai_result_view')
    } catch (error) {
      console.error('Failed to generate question:', error)
      toast.error('問いを生成できませんでした。もう一度お試しください')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAndContinue = () => {
    gaEvent('toro_lp_save_intent')
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('toro_draft', content)
    }
    router.push('/login?returnUrl=/write')
  }

  const handleDismiss = () => {
    setQuestion(null)
    // Optional: Scroll to next section or just reset
    // For now, just reset the question view so they can try again or leave
  }

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 px-5 py-24 md:px-8 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-3xl space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            いま、何に迷っていますか。
          </h2>
          <p className="text-muted-foreground text-lg">
            1行で大丈夫です。あとで書き直せます。
          </p>
        </div>

        {/* Interaction Area */}
        <div className="relative">
          <div className="relative group min-h-[300px] bg-background border border-muted-foreground/10 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/20">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleTextChange}
              placeholder="今日いちばん迷っていることは？"
              className="w-full h-full min-h-[300px] bg-transparent border-none rounded-3xl p-8 text-lg font-light leading-relaxed placeholder:text-muted-foreground/40 resize-none outline-none focus:ring-0"
            />
            
            {/* Interim Text Overlay */}
            {interimText && (
              <div className="absolute inset-0 p-8 pointer-events-none text-lg font-light leading-relaxed tracking-wide text-foreground/30 italic">
                <span className="invisible">{content}</span>
                <span>{interimText}</span>
              </div>
            )}

            {/* Mic Button */}
            <div className="absolute bottom-6 right-6">
              <button
                onClick={toggleRecording}
                className={`flex items-center justify-center p-4 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-50 text-red-500 shadow-inner' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
                title={isListening ? "停止" : "音声で入力"}
              >
                {isListening ? (
                  <div className="relative">
                    <Mic className="w-6 h-6 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                  </div>
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center md:justify-start">
            <button
              onClick={handleGenerateValues}
              disabled={!content.trim() || isGenerating}
              className="group relative inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-primary-foreground shadow-lg transition-all hover:translate-y-[-2px] hover:shadow-xl disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
            >
              {isGenerating ? (
                <LoadingSpinner className="w-5 h-5 text-primary-foreground" />
              ) : (
                <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
              )}
              <span className="font-medium tracking-wide">AIに問いを立ててもらう</span>
            </button>
          </div>
        </div>

        {/* Result Area */}
        <AnimatePresence>
          {question && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="bg-white/80 backdrop-blur-sm border border-primary/10 rounded-3xl p-8 md:p-10 shadow-xl space-y-8 mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary/60 text-sm font-medium tracking-wider uppercase">
                    <Wand className="w-4 h-4" />
                    AIからの問い
                  </div>
                  <p className="text-2xl md:text-3xl font-serif text-foreground leading-relaxed">
                    {question}
                  </p>
                </div>

                <div className="pt-8 border-t border-muted/20 space-y-6">
                  <p className="text-muted-foreground text-center md:text-left">
                    この続きを、あとから見返せるように残しますか？
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button
                      onClick={handleSaveAndContinue}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-3 font-medium transition-colors hover:bg-foreground/90"
                    >
                      <span>残して続ける</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="w-full sm:w-auto px-6 py-3 text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      今はいいです
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  )
}
