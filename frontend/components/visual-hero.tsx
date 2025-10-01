"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function VisualHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16">
      <div
        className={`relative grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Yoga/Meditation Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-primary/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10 group-hover:from-primary/20 transition-all duration-700" />
          <Image
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&h=400&fit=crop"
            alt="Yoga and Meditation"
            width={350}
            height={400}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              Find Your Balance
            </h3>
            <p className="text-white/90 text-sm">
              Through mindful yoga practice
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary/60 animate-breathe z-20" />
        </div>

        {/* Mental Wellness Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-accent/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-10 group-hover:from-accent/20 transition-all duration-700" />
          <Image
            src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&h=400&fit=crop"
            alt="Mental Wellness"
            width={350}
            height={400}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              Nurture Your Mind
            </h3>
            <p className="text-white/90 text-sm">
              Achieve mental clarity and peace
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent/60 animate-breathe z-20" />
        </div>

        {/* Physical Fitness Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-secondary/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent z-10 group-hover:from-secondary/20 transition-all duration-700" />
          <Image
            src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=400&fit=crop"
            alt="Physical Fitness"
            width={350}
            height={400}
            className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              Strengthen Your Body
            </h3>
            <p className="text-white/90 text-sm">
              Build lasting physical vitality
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-secondary/60 animate-breathe z-20" />
        </div>
      </div>

      <div className="absolute -top-8 -left-8 w-16 h-16 opacity-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-primary animate-pulse"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M50 20 L50 80 M20 50 L80 50"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="absolute -bottom-8 -right-8 w-20 h-20 opacity-10">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-accent animate-spin-slow"
        >
          <path
            d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
