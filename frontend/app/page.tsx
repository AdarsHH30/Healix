import { HeroSection } from "@/components/hero-section"
import { CredentialsBar } from "@/components/credentials-bar"
import { BenefitsSection } from "@/components/benefits-section"
import { ProcessSection } from "@/components/process-section"
import { Testimonials } from "@/components/testimonials"
import { Instructors } from "@/components/instructors"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CredentialsBar />
      <BenefitsSection />
      <ProcessSection />
      <Testimonials />
      <Instructors />
      <Footer />
    </main>
  )
}
