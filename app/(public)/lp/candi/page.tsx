import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { ValueSection } from "@/components/landing/value-section"
import { AfterSection } from "@/components/landing/after-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ProblemSection />
      <ValueSection />
      <AfterSection />
      <FeaturesSection />
      <Footer />
    </main>
  )
}
