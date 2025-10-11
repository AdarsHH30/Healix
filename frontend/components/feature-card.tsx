"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
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

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
  duration = "30 min",
  level = "All Levels",
  instructorName = "",
  instructorImage = "",
  category = "Wellness",
}: WellnessPillarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: {
      bg: "bg-primary/10 group-hover:bg-primary/15 dark:bg-primary/8 dark:group-hover:bg-primary/12",
      text: "text-primary dark:text-black",
      gradient: "from-primary/20 via-primary/10 to-transparent",
      border: "hover:border-primary/40 dark:hover:border-primary/30",
      shadow: "hover:shadow-primary/25 dark:hover:shadow-primary/15",
      glow: "shadow-primary/20",
      accent: "from-black to-black",
    },
    accent: {
      bg: "bg-accent/10 group-hover:bg-accent/15 dark:bg-accent/8 dark:group-hover:bg-accent/12",
      text: "text-accent dark:text-accent",
      gradient: "from-accent/20 via-accent/10 to-transparent",
      border: "hover:border-accent/40 dark:hover:border-accent/30",
      shadow: "hover:shadow-accent/25 dark:hover:shadow-accent/15",
      glow: "shadow-accent/20",
      accent: "from-accent to-accent/80",
    },
    secondary: {
      bg: "bg-secondary/10 group-hover:bg-secondary/15 dark:bg-secondary/8 dark:group-hover:bg-secondary/12",
      text: "text-secondary dark:text-secondary",
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
      border: "hover:border-secondary/40 dark:hover:border-secondary/30",
      shadow: "hover:shadow-secondary/25 dark:hover:shadow-secondary/15",
      glow: "shadow-secondary/20",
      accent: "from-secondary to-secondary/80",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className="group relative"
      style={{
        animation: "fadeInUp 0.8s ease-out forwards",
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl scale-110`}
      />

      <Card
        className={`relative overflow-hidden bg-card/50 dark:bg-card/30 backdrop-blur-md border-border/60 dark:border-border/40 hover:shadow-2xl ${colors.border} ${colors.shadow} transition-all duration-700 hover:-translate-y-3 cursor-pointer group-hover:bg-card/80 dark:group-hover:bg-card/50`}
        style={{
          borderRadius: "28px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        />

        {/* Multiple floating orbs */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 ${colors.bg} rounded-full blur-3xl opacity-20 group-hover:scale-150 group-hover:opacity-40 transition-all duration-700`}
        />
        <div
          className={`absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 ${colors.bg} rounded-full blur-2xl opacity-15 group-hover:scale-125 group-hover:opacity-30 transition-all duration-1000 delay-200`}
        />

        <div className="relative p-6 sm:p-7 md:p-9">
          {/* Enhanced header */}
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${colors.text} px-3 md:px-4 py-1.5 rounded-full ${colors.bg} border border-current/20 backdrop-blur-sm`}
              >
                {category}
              </span>
              {isHovered && (
                <Sparkles className={`w-4 h-4 ${colors.text} animate-pulse`} />
              )}
            </div>
            <div
              className={`inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl md:rounded-3xl ${colors.bg} group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl backdrop-blur-sm border border-current/10`}
            >
              <Icon
                className={`h-6 w-6 md:h-7 md:w-7 ${colors.text} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
          </div>

          {/* Enhanced title */}
          <h3
            className={`mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground dark:text-foreground group-hover:${colors.text} transition-colors duration-500 leading-tight`}
          >
            {title}
          </h3>

          {/* Enhanced description */}
          <p className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed mb-5 md:mb-6 text-sm md:text-base lg:text-lg">
            {description}
          </p>

          {/* Enhanced metadata */}
          <div className="flex items-center gap-4 md:gap-5 mb-5 md:mb-6 text-xs md:text-sm text-muted-foreground dark:text-muted-foreground/70">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 dark:bg-muted/10 backdrop-blur-sm">
              <Clock className="h-4 w-4 md:h-4 md:w-4" />
              <span className="font-medium">{duration}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 dark:bg-muted/10 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 md:h-4 md:w-4" />
              <span className="font-medium">{level}</span>
            </div>
          </div>

          {/* Enhanced instructor section */}
          {instructorName && instructorName.trim() !== "" && (
            <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 p-3 rounded-2xl bg-muted/10 dark:bg-muted/5 backdrop-blur-sm border border-border/30">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-border shadow-lg">
                  <img
                    src={
                      instructorImage ||
                      "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                    }
                    alt={instructorName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${colors.accent} rounded-full border-2 border-background shadow-sm`}
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground dark:text-muted-foreground/60 mb-0.5">
                  Led by
                </p>
                <p className="text-sm md:text-base font-semibold text-foreground dark:text-foreground">
                  {instructorName}
                </p>
              </div>
            </div>
          )}

          {/* Enhanced button */}
          <div
            className={`transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-90 translate-y-1"
            }`}
          >
            <Button
              className={`w-full h-12 md:h-14 rounded-2xl text-sm md:text-base font-semibold bg-gradient-to-r ${colors.accent} text-white hover:scale-105 hover:shadow-lg ${colors.glow} transition-all duration-300 group/btn border-0 relative overflow-hidden`}
              variant="default"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

              <span className="relative z-10 flex items-center justify-center gap-2">
                Learn More
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 dark:via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </Card>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export function WellnessPillarCard({
  icon: Icon,
  title,
  description,
  color,
  delay = 0,
  duration = "30 min",
  level = "All Levels",
  instructorName = "Certified Instructor",
  instructorImage = "https://api.dicebear.com/7.x/avataaars/svg?seed=instructor",
  category = "Wellness",
}: WellnessPillarCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    primary: {
      bg: "bg-primary/10 group-hover:bg-primary/15 dark:bg-primary/8 dark:group-hover:bg-primary/12",
      text: "text-primary dark:text-black",
      gradient: "from-primary/20 via-primary/10 to-transparent",
      border: "hover:border-primary/40 dark:hover:border-primary/30",
      shadow: "hover:shadow-primary/25 dark:hover:shadow-primary/15",
      glow: "shadow-primary/20",
      accent: "from-black to-black",
    },
    accent: {
      bg: "bg-accent/10 group-hover:bg-accent/15 dark:bg-accent/8 dark:group-hover:bg-accent/12",
      text: "text-accent dark:text-accent",
      gradient: "from-accent/20 via-accent/10 to-transparent",
      border: "hover:border-accent/40 dark:hover:border-accent/30",
      shadow: "hover:shadow-accent/25 dark:hover:shadow-accent/15",
      glow: "shadow-accent/20",
      accent: "from-accent to-accent/80",
    },
    secondary: {
      bg: "bg-secondary/10 group-hover:bg-secondary/15 dark:bg-secondary/8 dark:group-hover:bg-secondary/12",
      text: "text-secondary dark:text-secondary",
      gradient: "from-secondary/20 via-secondary/10 to-transparent",
      border: "hover:border-secondary/40 dark:hover:border-secondary/30",
      shadow: "hover:shadow-secondary/25 dark:hover:shadow-secondary/15",
      glow: "shadow-secondary/20",
      accent: "from-secondary to-secondary/80",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className="group relative"
      style={{
        animation: "fadeInUp 0.8s ease-out forwards",
        animationDelay: `${delay}ms`,
        opacity: 0,
      }}
    >
      {/* Enhanced glow effect */}
      <div
        className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-all duration-700 blur-xl scale-110`}
      />

      <Card
        className={`relative overflow-hidden bg-card/50 dark:bg-card/30 backdrop-blur-md border-border/60 dark:border-border/40 hover:shadow-2xl ${colors.border} ${colors.shadow} transition-all duration-700 hover:-translate-y-3 cursor-pointer group-hover:bg-card/80 dark:group-hover:bg-card/50`}
        style={{
          borderRadius: "28px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        />

        {/* Multiple floating orbs */}
        <div
          className={`absolute top-0 right-0 w-32 h-32 md:w-40 md:h-40 ${colors.bg} rounded-full blur-3xl opacity-20 group-hover:scale-150 group-hover:opacity-40 transition-all duration-700`}
        />
        <div
          className={`absolute bottom-0 left-0 w-24 h-24 md:w-32 md:h-32 ${colors.bg} rounded-full blur-2xl opacity-15 group-hover:scale-125 group-hover:opacity-30 transition-all duration-1000 delay-200`}
        />

        <div className="relative p-6 sm:p-7 md:p-9">
          {/* Enhanced header */}
          <div className="flex items-center justify-between mb-4 md:mb-5">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${colors.text} px-3 md:px-4 py-1.5 rounded-full ${colors.bg} border border-current/20 backdrop-blur-sm`}
              >
                {category}
              </span>
              {isHovered && (
                <Sparkles className={`w-4 h-4 ${colors.text} animate-pulse`} />
              )}
            </div>
            <div
              className={`inline-flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl md:rounded-3xl ${colors.bg} group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-xl backdrop-blur-sm border border-current/10`}
            >
              <Icon
                className={`h-6 w-6 md:h-7 md:w-7 ${colors.text} group-hover:scale-110 transition-transform duration-300`}
              />
            </div>
          </div>

          {/* Enhanced title */}
          <h3
            className={`mb-3 md:mb-4 text-2xl md:text-3xl lg:text-4xl font-bold text-foreground dark:text-foreground group-hover:${colors.text} transition-colors duration-500 leading-tight`}
          >
            {title}
          </h3>

          {/* Enhanced description */}
          <p className="text-muted-foreground dark:text-muted-foreground/80 leading-relaxed mb-5 md:mb-6 text-sm md:text-base lg:text-lg">
            {description}
          </p>

          {/* Enhanced metadata */}
          <div className="flex items-center gap-4 md:gap-5 mb-5 md:mb-6 text-xs md:text-sm text-muted-foreground dark:text-muted-foreground/70">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 dark:bg-muted/10 backdrop-blur-sm">
              <Clock className="h-4 w-4 md:h-4 md:w-4" />
              <span className="font-medium">{duration}</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/20 dark:bg-muted/10 backdrop-blur-sm">
              <TrendingUp className="h-4 w-4 md:h-4 md:w-4" />
              <span className="font-medium">{level}</span>
            </div>
          </div>

          {/* Enhanced instructor section */}
          <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6 p-3 rounded-2xl bg-muted/10 dark:bg-muted/5 backdrop-blur-sm border border-border/30">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-border shadow-lg">
                <img
                  src={
                    instructorImage ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                  }
                  alt={instructorName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${colors.accent} rounded-full border-2 border-background shadow-sm`}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground dark:text-muted-foreground/60 mb-0.5">
                Led by
              </p>
              <p className="text-sm md:text-base font-semibold text-foreground dark:text-foreground">
                {instructorName}
              </p>
            </div>
          </div>

          {/* Enhanced button */}
          <div
            className={`transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-90 translate-y-1"
            }`}
          >
            <Button
              className={`w-full h-12 md:h-14 rounded-2xl text-sm md:text-base font-semibold bg-gradient-to-r ${colors.accent} text-white hover:scale-105 hover:shadow-lg ${colors.glow} transition-all duration-300 group/btn border-0 relative overflow-hidden`}
              variant="default"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />

              <span className="relative z-10 flex items-center justify-center gap-2 ">
                Learn More
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>

        {/* Enhanced shine effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 dark:via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </Card>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
