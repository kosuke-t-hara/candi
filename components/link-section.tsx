'use client'

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, ExternalLink } from "lucide-react"

interface LinkData {
  id: string
  url: string
  label: string | null
}

interface LinkSectionProps {
  links: LinkData[]
  limit?: number
  onAddLink: (url: string, label?: string) => Promise<void>
  onDeleteLink: (linkId: string) => Promise<void>
  title?: string
}

export function LinkSection({
  links,
  limit = 5,
  onAddLink,
  onDeleteLink,
  title = "リンク"
}: LinkSectionProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newUrl, setNewUrl] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newUrl) return
    setError(null)
    
    // Auto-prefix http if missing
    let formattedUrl = newUrl
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }

    startTransition(async () => {
      try {
        await onAddLink(formattedUrl, newLabel || undefined)
        setIsAdding(false)
        setNewUrl("")
        setNewLabel("")
      } catch (e: any) {
        if (e.message?.includes('Maximum 5')) {
          setError('最大5件までです')
        } else {
          setError('リンクの追加に失敗しました')
        }
      }
    })
  }

  const handleDelete = (id: string) => {
    if (!confirm('このリンクを削除しますか？')) return
    startTransition(async () => {
      try {
        await onDeleteLink(id)
      } catch (e) {
        alert('削除に失敗しました')
      }
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {links.length < limit && !isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="h-8 text-xs text-blue-600 hover:text-blue-700"
          >
            <Plus className="w-3 h-3 mr-1" />
            リンクを追加
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <div 
            key={link.id} 
            className="group flex items-center justify-between p-2 rounded-md border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
          >
            <a 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center min-w-0 flex-1 hover:opacity-80"
            >
              <div className="bg-white p-1.5 rounded-md border border-gray-200 mr-3">
                 {/* Google Favicon API or generic icon */}
                 <img 
                   src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`}
                   alt=""
                   className="w-4 h-4 object-contain opacity-70"
                   onError={(e) => {
                     (e.target as HTMLImageElement).style.display = 'none';
                     (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                   }}
                 />
                 <ExternalLink className="w-4 h-4 text-gray-400 hidden" />
              </div>
              <div className="truncate">
                {link.label && (
                   <div className="text-xs font-medium text-gray-900 truncate">{link.label}</div>
                )}
                <div className={`text-xs text-gray-500 truncate ${!link.label ? 'font-medium text-gray-700' : ''}`}>
                  {link.url}
                </div>
              </div>
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(link.id)}
              disabled={isPending}
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}

        {links.length === 0 && !isAdding && (
          <div className="text-xs text-gray-400 text-center py-2">
            リンクはまだありません
          </div>
        )}
      </div>

      {isAdding && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="space-y-2">
            <div>
              <Label htmlFor="link-url" className="text-xs">URL <span className="text-red-500">*</span></Label>
              <Input
                id="link-url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div>
              <Label htmlFor="link-label" className="text-xs">ラベル (任意)</Label>
              <Input
                id="link-label"
                placeholder="例: 面接URL"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="h-8 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>
          
          {error && <div className="text-xs text-red-600">{error}</div>}

          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setIsAdding(false)
                setError(null)
              }}
              className="h-7 text-xs"
            >
              キャンセル
            </Button>
            <Button 
              size="sm" 
              onClick={handleAdd}
              disabled={!newUrl || isPending}
              className="h-7 text-xs"
            >
              {isPending && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
              追加する
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
