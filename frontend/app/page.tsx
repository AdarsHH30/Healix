import { HeroSection } from "@/components/hero-section";
import { BenefitsSection } from "@/components/benefits-section";
import { ProcessSection } from "@/components/process-section";
import { CTASection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      {/* <BenefitsSection /> */}
      {/* <ProcessSection /> */}
      <CTASection />
      <Footer />
    </main>
  );
}
