import Link from "next/link"
import { History } from "lucide-react"

const ToroIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path
      d="M32 10c-13.255 0-24 8.954-24 20 0 6.962 4.366 13.09 11.07 16.77l-1.7 7.15a1.5 1.5 0 0 0 2.27 1.6l8.44-5.26c1.27.17 2.59.26 3.92.26 13.255 0 24-8.954 24-20S45.255 10 32 10Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <circle cx="24" cy="30.5" r="2.0" fill="#544F4B" />
    <circle cx="32" cy="28.5" r="2.6" fill="#544F4B" />
    <circle cx="41" cy="31.5" r="1.8" fill="#544F4B" />
  </svg>
)

export default function ToroHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12 animate-in fade-in duration-1000">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extralight tracking-widest text-black/80">
          Toro Notes
        </h1>
        <p className="text-sm md:text-base text-black/50 font-light tracking-wide italic">
          書かなくてもいい。
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-12 pt-8">
        <Link 
          href="/write"
          className="group relative flex flex-col items-center justify-center min-w-[200px] px-12 py-4 rounded-full transition-all duration-500 bg-[#544F4B] hover:opacity-90 text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-2">
            <ToroIcon className="w-5 h-5 opacity-90" />
            <span className="text-lg font-light tracking-widest">Toroする</span>
          </div>
          <span className="text-[10px] opacity-60 font-light tracking-tight mt-0.5">
            まとまらなくても
          </span>
        </Link>
        
        <Link 
          href="/past"
          className="group relative flex items-center justify-center min-w-[200px] px-12 py-4 border border-black/10 rounded-full hover:border-black/30 transition-all duration-500 bg-white/50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-black/40 group-hover:text-black/60 transition-colors" />
            <span className="text-lg font-light tracking-widest text-black/60 group-hover:text-black transition-colors">ふりかえる</span>
          </div>
        </Link>
      </div>

      <div className="pt-16">
        <Link 
          href="/candi"
          className="text-xs md:text-sm text-black/30 hover:text-black/60 transition-colors tracking-tighter"
        >
          キャリアについて考える
        </Link>
      </div>
    </div>
  )
}
