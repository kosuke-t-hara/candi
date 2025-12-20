'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Entry {
  id: string
  content: string
  created_at: string
}

interface PastClientProps {
  entries: Entry[]
}

export default function PastClient({ entries }: PastClientProps) {
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null)
  const router = useRouter()

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
          <h1 className="text-2xl font-light tracking-widest text-black/70">過去</h1>
          <button 
            onClick={() => router.push('/')}
            className="text-xs text-black/20 hover:text-black/40 transition-colors"
          >
            戻る
          </button>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-24 text-black/20 font-light tracking-widest">
            まだ、なにも。
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
      </div>

      {/* Modal */}
      {selectedEntry && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500"
          onClick={() => setSelectedEntry(null)}
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />
          
          <div 
            className="relative w-full max-w-xl max-h-[80vh] bg-white/80 shadow-2xl shadow-black/5 rounded-2xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-black/[0.03]">
              <div className="text-[10px] text-black/30 font-light tracking-tighter uppercase">
                {formatDate(selectedEntry.created_at)}
              </div>
              <button 
                onClick={() => setSelectedEntry(null)}
                className="text-black/20 hover:text-black/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto font-light leading-relaxed text-black/70 whitespace-pre-wrap">
              {selectedEntry.content}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
