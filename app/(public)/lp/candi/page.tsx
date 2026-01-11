import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { ValueSection } from "@/components/landing/value-section"
import { AfterSection } from "@/components/landing/after-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { Footer } from "@/components/landing/footer"
import { TrackSection } from "@/components/TrackSection"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <TrackSection section="hero">
        <HeroSection />
      </TrackSection>
      <TrackSection section="decision_is_hard">
        <ProblemSection />
      </TrackSection>
      <TrackSection section="thinking_to_judgement">
        <ValueSection />
      </TrackSection>
      <TrackSection section="after_using">
        <AfterSection />
      </TrackSection>
      <TrackSection section="examples">
        <FeaturesSection />
      </TrackSection>
      <TrackSection section="final_cta">
        <Footer />
      </TrackSection>
    </main>
  )
}
