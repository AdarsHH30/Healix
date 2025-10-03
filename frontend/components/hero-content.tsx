"use client";

import { Button } from "@/components/ui/button";
import { Video, ArrowRight, Heart, CheckCircle2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function HeroContent() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div className="text-center relative z-10">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm px-5 py-2.5 shadow-lg border border-primary/10 hover:shadow-xl hover:scale-105 transition-all duration-500">
        <Heart
          className="h-4 w-4 text-primary animate-pulse"
          fill="currentColor"
        />
        <span className="text-sm font-medium text-foreground">
          Join 10,000+ Active Members on Their Wellness Journey
        </span>
      </div>

      {/* Main headline - kept as requested */}
      <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight text-balance leading-tight">
        <span className="text-foreground">Transform Your Life Through</span>
        <br />
        <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
          Healix
        </span>
      </h1>

      {/* Subheadline with better line height */}
      <p className="mx-auto mb-10 max-w-2xl text-lg md:text-xl text-muted-foreground text-balance leading-relaxed">
        Discover balance and vitality through our comprehensive approach to
        wellness. Expert-led tutorials in yoga, mental health, and physical
        fitness—all in one place.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
        {user ? (
          <>
            <Button
              size="lg"
              className="relative text-base px-8 h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-500 group overflow-hidden"
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
              className="text-base px-8 h-14 rounded-full border-2 border-primary/30 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-primary hover:scale-105 transition-all duration-500"
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
              className="relative text-base px-8 h-14 rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all duration-500 group overflow-hidden"
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
              className="text-base px-8 h-14 rounded-full border-2 border-primary/30 bg-white/50 backdrop-blur-sm hover:bg-white hover:border-primary hover:scale-105 transition-all duration-500"
            >
              Explore Tutorials
            </Button>
          </>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span>Certified Wellness Experts</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4 text-primary" />
          <span>Science-Backed Programs</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex -space-x-3">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face"
              alt="Instructor"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Video className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            500+ Expert-Led Tutorials
          </span>
        </div>
      </div>
    </div>
  );
}
