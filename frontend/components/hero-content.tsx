"use client";

import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Heart, CheckCircle2, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function HeroContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  return (
    <div className="text-center relative z-10 px-4">
      <div className="mb-6 md:mb-8 inline-flex items-center gap-2 clean-card px-4 md:px-5 py-2 md:py-2.5 clean-hover">
        <Heart
          className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent"
          fill="currentColor"
        />
        <span className="text-xs md:text-sm font-medium text-muted-foreground">
          Join 10,000+ Active Members on Their Wellness Journey
        </span>
      </div>

      {/* Main headline */}
      <h1 className="mb-4 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-balance leading-tight">
        <span className="text-foreground">Transform Your Life Through</span>
        <br />
        <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-accent">
          Healix
        </span>
      </h1>

      {/* Subheadline */}
      <p className="mx-auto mb-6 md:mb-10 max-w-2xl text-base md:text-lg lg:text-xl text-muted-foreground text-balance leading-relaxed px-4">
        Discover{" "}
        <span className="text-base md:text-lg lg:text-xl text-accent font-medium">
          balance and vitality
        </span>{" "}
        through our comprehensive approach to wellness. Expert-led tutorials in
        yoga, mental health, and physical fitness—all in one place.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 px-4">
        {loading ? (
          <div className="flex gap-3 md:gap-4">
            <div className="w-full sm:w-48 h-12 md:h-14 bg-muted/50 rounded-full animate-pulse" />
            <div className="w-full sm:w-36 h-12 md:h-14 bg-muted/30 rounded-full animate-pulse" />
          </div>
        ) : user ? (
          <>
            <Button
              size="lg"
              className="w-full sm:w-auto relative text-sm md:text-base px-6 md:px-8 h-12 md:h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-500 group overflow-hidden"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 h-12 md:h-14 rounded-full border-2 border-primary/30 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-primary hover:scale-105 transition-all duration-500"
              onClick={() => {
                router.push("/profile");
              }}
            >
              View Profile
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              className="w-full sm:w-auto relative text-sm md:text-base px-6 md:px-8 h-12 md:h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-500 group overflow-hidden"
              onClick={() => {
                router.push("/login");
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto text-sm md:text-base px-6 md:px-8 h-12 md:h-14 rounded-full border-2 border-primary/30 backdrop-blur-sm hover:border-primary hover:text-primary hover:scale-105 transition-all duration-500"
            >
              Explore Tutorials
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6 md:mb-8 text-xs md:text-sm text-muted-foreground px-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          <span>Certified Wellness Experts</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          <span>Science-Backed Programs</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-4 md:mb-6">
        <div className="flex -space-x-2 md:-space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs md:text-sm">
          <Video className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
          <span className="font-medium text-foreground">
            500+ Expert-Led Tutorials
          </span>
        </div>
      </div>
    </div>
  );
}
