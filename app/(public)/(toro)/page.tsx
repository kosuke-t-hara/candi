import Link from "next/link"

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
          className="group relative px-12 py-4 border border-black/10 rounded-full hover:border-black/30 transition-all duration-500 bg-white/50 backdrop-blur-sm"
        >
          <span className="relative z-10 text-lg font-light tracking-widest group-hover:text-black transition-colors">Toroする</span>
          <div className="absolute inset-0 bg-black/5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
        </Link>
        
        <Link 
          href="/past"
          className="group relative px-12 py-4 border border-black/10 rounded-full hover:border-black/30 transition-all duration-500 bg-white/50 backdrop-blur-sm"
        >
          <span className="relative z-10 text-lg font-light tracking-widest group-hover:text-black transition-colors">過去を見る</span>
          <div className="absolute inset-0 bg-black/5 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
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
