import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { MemoSection } from "@/components/landing/memo-section"
import { TargetSection } from "@/components/landing/target-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <MemoSection />
      <TargetSection />
      <Footer />
    </main>
  )
}
