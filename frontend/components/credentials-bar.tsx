"use client";

import { CheckCircle2, Shield, Star, Lock } from "lucide-react";

export function CredentialsBar() {
  return (
    <section className="py-12 bg-white/80 backdrop-blur-sm border-y border-border shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Certified Instructors
              </p>
              <p className="text-xs text-muted-foreground">
                Verified Professionals
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-border" />

          <div className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 group-hover:bg-accent/20 transition-all duration-300">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Health Professionals
              </p>
              <p className="text-xs text-muted-foreground">
                Science-Backed Programs
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-border" />

          <div className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-300">
              <Lock className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Privacy Protected
              </p>
              <p className="text-xs text-muted-foreground">
                Your Data is Secure
              </p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-border" />

          <div className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
              <Star className="h-6 w-6 text-primary fill-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                4.9/5 Rating
              </p>
              <p className="text-xs text-muted-foreground">
                From 10,000+ Members
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <img
              src="https://api.dicebear.com/7.x/shapes/svg?seed=health-cert&backgroundColor=86a88e"
              alt="Health Coach Certified"
              className="h-6 opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50">
            <img
              src="https://api.dicebear.com/7.x/shapes/svg?seed=wellness-cert&backgroundColor=b8a88e"
              alt="Wellness Certified"
              className="h-6 opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
