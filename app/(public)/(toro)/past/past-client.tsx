'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Archive, RotateCcw } from 'lucide-react'
import { archiveToroEntry, unarchiveToroEntry } from '@/app/actions/toro'

interface Entry {
  id: string
  content: string
  created_at: string
}

interface PastClientProps {
  entries: Entry[]
  isArchivedView?: boolean
}

export default function PastClient({ entries, isArchivedView = false }: PastClientProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setSelectedEntry(null)
      setIsClosing(false)
      setIsConfirming(false)
    }, 300)
  }

  const handleArchive = async () => {
    if (!selectedEntry) return
    setIsProcessing(true)
    try {
      await archiveToroEntry(selectedEntry.id)
      handleClose()
    } catch (error) {
      console.error('Failed to archive:', error)
      alert('エラーが発生しました。')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUnarchive = async () => {
    if (!selectedEntry) return
    setIsProcessing(true)
    try {
      await unarchiveToroEntry(selectedEntry.id)
      handleClose()
    } catch (error) {
      console.error('Failed to unarchive:', error)
      alert('エラーが発生しました。')
    } finally {
      setIsProcessing(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-widest text-black/70">
            {isArchivedView ? 'しまったもの' : ''}
          </h1>
          <button 
            onClick={() => isArchivedView ? router.push('/past') : router.push('/')}
            className="text-xs text-black/20 hover:text-black/40 transition-colors"
          >
            戻る
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-24 text-black/20 font-light tracking-widest">
            {isArchivedView ? 'なにも、しまっていません。' : 'まだ、なにも。'}
          </div>
        ) : (
          <div className="space-y-6">
            {entries.map((entry) => (
              <div 
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="group cursor-pointer py-4 border-b border-black/[0.03] hover:border-black/[0.08] transition-all"
              >
                <div className="text-[10px] text-black/20 mb-1 font-light tracking-tighter">
                  {formatDate(entry.created_at)}
                </div>
                <div className="relative">
                  <p className="text-sm font-light text-black/60 line-clamp-1 pr-12">
                    {entry.content}
                  </p>
                  <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#fdfdfd] to-transparent pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isArchivedView && (
          <div className="flex justify-center pt-12">
            <button
              onClick={() => router.push('/past?view=archived')}
              className="text-[10px] text-black/10 hover:text-black/30 tracking-[0.2em] transition-all font-light"
            >
              しまったもの
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEntry && (
        <div 
          className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-opacity duration-300 ease-linear ${
            isClosing ? 'opacity-0' : 'opacity-100'
          }`}
          onClick={handleClose}
        >
          <div className={`absolute inset-0 bg-white/40 transition-all duration-300 ease-linear ${
            isClosing ? 'backdrop-blur-none' : 'backdrop-blur-sm'
          }`} />
          
          <div 
            className={`relative w-full max-w-xl max-h-[80vh] bg-white/80 shadow-2xl shadow-black/5 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 ease-out ${
              isClosing ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100 animate-in fade-in zoom-in-95'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-black/[0.03]">
              <div className="text-[10px] text-black/30 font-light tracking-tighter uppercase">
                {formatDate(selectedEntry.created_at)}
              </div>
              <button 
                onClick={handleClose}
                className="text-black/20 hover:text-black/60 transition-colors"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-8 pb-4 overflow-y-auto font-light leading-relaxed text-black/70 whitespace-pre-wrap flex-1">
              {selectedEntry.content}
            </div>

            <div className="p-6 pt-0 flex justify-end">
              {isArchivedView ? (
                <button
                  onClick={handleUnarchive}
                  disabled={isProcessing}
                  className="text-xs text-black/30 hover:text-black/60 transition-colors font-light tracking-widest flex items-center gap-2"
                >
                  {isProcessing ? '...' : (
                    <>
                      <RotateCcw className="w-3 h-3" />
                      戻す
                    </>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-4 transition-all duration-300">
                  {isConfirming ? (
                    <div className="flex items-center gap-6 animate-in fade-in slide-in-from-right-2">
                       <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-black/40 font-light tracking-widest">しまいますか。</span>
                        <span className="text-[8px] text-black/20 font-light tracking-tighter">あとで戻せます。</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleArchive}
                          disabled={isProcessing}
                          className="text-xs text-black/60 hover:text-black/90 transition-colors font-light tracking-widest uppercase"
                        >
                          {isProcessing ? '...' : 'しまう'}
                        </button>
                        <button
                          onClick={() => setIsConfirming(false)}
                          disabled={isProcessing}
                          className="text-xs text-black/20 hover:text-black/40 transition-colors font-light tracking-widest uppercase"
                        >
                          やめる
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsConfirming(true)}
                      className="text-xs text-black/20 hover:text-black/40 transition-colors font-light tracking-widest flex items-center gap-2"
                    >
                      しまう
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}



