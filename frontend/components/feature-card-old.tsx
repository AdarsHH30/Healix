"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

interface WellnessPillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: "primary" | "accent" | "secondary";
  delay?: number;
  duration?: string;
  level?: string;
  instructorName?: string;
  instructorImage?: string;
  category?: string;
}

export function WellnessPillarCard({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
  duration = "30 min",
  level = "Intermediate",
  instructorName = "Expert Instructor",
  instructorImage,
  category = "Wellness",
}: WellnessPillarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: {
      bg: "bg-primary/10 group-hover:bg-primary/20",
      text: "text-primary",
      gradient: "from-primary/20 via-primary/10",
      border: "hover:border-primary/30",
      shadow: "hover:shadow-primary/20",
      overlay: "from-primary/5 to-transparent",
    },
    accent: {
      bg: "bg-accent/10 group-hover:bg-accent/20",
      text: "text-accent",
      gradient: "from-accent/20 via-accent/10",
      border: "hover:border-accent/30",
      shadow: "hover:shadow-accent/20",
      overlay: "from-accent/5 to-transparent",
    },
    secondary: {
      bg: "bg-secondary/10 group-hover:bg-secondary/20",
      text: "text-secondary",
      gradient: "from-secondary/20 via-secondary/10",
      border: "hover:border-secondary/30",
      shadow: "hover:shadow-secondary/20",
      overlay: "from-secondary/5 to-transparent",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card
      className={`group relative overflow-hidden bg-white/90 backdrop-blur-sm border-border hover:shadow-2xl ${colors.border} ${colors.shadow} transition-all duration-700 hover:-translate-y-2 cursor-pointer`}
      style={{
        animationDelay: `${delay}ms`,
        borderRadius: "24px", // Softer rounded corners (16px -> 24px)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      <div
        className={`absolute top-0 right-0 w-40 h-40 ${colors.bg} rounded-full blur-3xl opacity-30 group-hover:scale-150 group-hover:opacity-50 transition-all duration-700`}
      />

      <div className="relative p-5 sm:p-6 md:p-8">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <span
            className={`text-xs font-medium ${colors.text} px-2.5 md:px-3 py-1 rounded-full ${colors.bg}`}
          >
            {category}
          </span>
          <div
            className={`inline-flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl md:rounded-2xl ${colors.bg} group-hover:scale-110 transition-all duration-500`}
          >
            <Icon className={`h-5 w-5 md:h-6 md:w-6 ${colors.text}`} />
          </div>
        </div>

        <h3
          className={`mb-2 md:mb-3 text-2xl md:text-3xl font-semibold text-foreground group-hover:${colors.text} transition-colors duration-500`}
        >
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-4 md:mb-6 text-sm md:text-base">
          {description}
        </p>

        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>{duration}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span>{level}</span>
          </div>
        </div>

        {instructorName && instructorName.trim() !== "" && (
          <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-6">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-border">
              <Image
                src={
                  instructorImage ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                }
                alt={instructorName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Led by</p>
              <p className="text-xs md:text-sm font-medium text-foreground">
                {instructorName}
              </p>
            </div>
          </div>
        )}

        <div
          className={`transition-all duration-500 md:${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Button
            className={`w-full rounded-full text-sm md:text-base ${colors.bg} ${colors.text} hover:scale-105 transition-all duration-300 group/btn`}
            variant="ghost"
          >
            Learn More
            <ArrowRight className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
}