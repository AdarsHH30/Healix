"use client";

import { useEffect, useState } from "react";
import { Activity, Brain, Heart } from "lucide-react";
import dynamic from "next/dynamic";

const Background3DScene = dynamic(
  () =>
    import("./background-3d-scene").then((mod) => ({
      default: mod.Background3DScene,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
    ),
  }
);
import { Header } from "./header";
import { HeroContent } from "./hero-content";
import { FeatureCard } from "./feature-card";
import { StatsDisplay } from "./stats-display";
import { VisualHero } from "./visual-hero";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    setIsVisible(true);

    // Check if running in a browser that supports WebGL
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setShow3D(false);
      }
    } catch (_e) {
      setShow3D(false);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {show3D && <Background3DScene mousePosition={mousePosition} />}

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-float will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * 20}px, ${
              mousePosition.y * 20
            }px)`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
        <div
          className="absolute bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl animate-float-delayed will-change-transform"
          style={{
            transform: `translate(${mousePosition.x * -15}px, ${
              mousePosition.y * -15
            }px)`,
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Header />

        <div className="flex flex-col items-center justify-center py-16 sm:py-20 md:py-32">
          <div
            className={`transition-all duration-1000 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <HeroContent />
          </div>

          <div
            className={`transition-all duration-1000 delay-200 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <VisualHero />
          </div>

          <div
            className={`mt-16 sm:mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 w-full max-w-6xl transition-all duration-1000 delay-300 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <FeatureCard
              icon={Activity}
              title="Yoga"
              description="Build strength, flexibility, and inner peace through guided yoga practices for all levels."
              color="primary"
              duration="30 min"
              level="Beginner Friendly"
              instructorName="Sarah Chen"
              instructorImage="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
              category="Mind & Body"
            />
            <FeatureCard
              icon={Brain}
              title="Mental Health"
              description="Cultivate mindfulness, reduce stress, and enhance emotional well-being with expert guidance."
              color="accent"
              duration="25 min"
              level="All Levels"
              instructorName="Dr. James Wilson"
              instructorImage="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              category="Mindfulness"
            />
            <FeatureCard
              icon={Heart}
              title="Physical Fitness"
              description="Achieve your fitness goals with personalized workouts designed for sustainable results."
              color="secondary"
              duration="45 min"
              level="Intermediate"
              instructorName="Maya Rodriguez"
              instructorImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
              category="Strength"
            />
          </div>

          <div
            className={`mt-24 transition-all duration-1000 delay-500 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <StatsDisplay />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        .animate-float {
          animation: float 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 10s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
}
