"use client";

import { useEffect, useState } from "react";
import { Activity, Brain, Heart } from "lucide-react";
import dynamic from "next/dynamic";

import { Header } from "./header";
import { HeroContent } from "./hero-content";
import { FeatureCard } from "./feature-card";
import { StatsDisplay } from "./stats-display";
import { VisualHero } from "./visual-hero";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Clean background with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <Header />

        <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 lg:py-32 pt-20 sm:pt-24">
          <div
            className={`transition-all duration-1000 ease-in-out w-full ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <HeroContent />
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ease-in-out w-full ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <VisualHero />
          </div>

          <div
            className={`mt-12 sm:mt-16 md:mt-24 lg:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl transition-all duration-1000 delay-300 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <FeatureCard
              icon={Heart}
              title="Emergency Services"
              description="Instant access to emergency contacts and automated calling/SMS system for urgent situations."
              color="primary"
              duration="24/7"
              level="Always Available"
              instructorName=""
              instructorImage=""
              category="Emergency"
            />
            <FeatureCard
              icon={Brain}
              title="First Aid Guidance"
              description="AI-powered chatbot providing step-by-step first aid instructions for various emergency scenarios."
              color="accent"
              duration="Instant"
              level="All Situations"
              instructorName=""
              instructorImage=""
              category="First Aid"
            />
            <FeatureCard
              icon={Activity}
              title="Hospital Locator"
              description="Instantly find nearby hospitals and medical facilities with integrated map and location services."
              color="primary"
              duration="Real-time"
              level="Location-based"
              instructorName=""
              instructorImage=""
              category="Medical"
            />
          </div>

          <div
            className={`mt-16 sm:mt-20 md:mt-24 transition-all duration-1000 delay-500 ease-in-out w-full ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {/* <StatsDisplay /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
