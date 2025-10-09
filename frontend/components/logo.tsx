"use client";

import { Heart, Plus, Activity } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8 md:h-10 md:w-10",
    lg: "h-12 w-12 md:h-16 md:w-16",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4 md:h-5 md:w-5",
    lg: "h-6 w-6 md:h-8 md:w-8",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-bold",
    lg: "text-2xl md:text-3xl font-bold",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Health-focused logo design */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-accent to-accent/80 clean-shadow ${sizeClasses[size]}`}
      >
        {/* Medical cross background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Plus
            className={`text-white/30 ${iconSizes[size]}`}
            strokeWidth={3}
          />
        </div>

        {/* Heart with pulse */}
        <div className="relative flex items-center justify-center">
          <Heart
            className={`text-white ${iconSizes[size]} animate-pulse`}
            fill="currentColor"
            strokeWidth={1.5}
          />

          {/* Pulse line */}
          <div className="absolute -right-1 top-1/2 -translate-y-1/2">
            <Activity className="h-2 w-2 text-white/80" strokeWidth={2} />
          </div>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Alternative minimalist health logo
export function LogoMinimal({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8 md:h-10 md:w-10",
    lg: "h-12 w-12 md:h-16 md:w-16",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-bold",
    lg: "text-2xl md:text-3xl font-bold",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Minimalist health cross */}
      <div
        className={`relative flex items-center justify-center rounded-lg bg-primary clean-shadow ${sizeClasses[size]}`}
      >
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-full"></div>
          {/* Horizontal line */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-0.5 bg-white rounded-full"></div>
          {/* Center dot */}
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Medical H logo for Healix
export function LogoMedical({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8 md:h-10 md:w-10",
    lg: "h-12 w-12 md:h-16 md:w-16",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-bold",
    lg: "text-2xl md:text-3xl font-bold",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Stylized H for Health/Healix */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 clean-shadow ${sizeClasses[size]}`}
      >
        <div className="text-white font-black text-lg leading-none">H</div>
        {/* Small pulse indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// SVG-based medical logo
export function LogoSVG({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8 md:h-10 md:w-10",
    lg: "h-12 w-12 md:h-16 md:w-16",
  };

  const textSizes = {
    sm: "text-base font-bold",
    md: "text-lg md:text-xl font-bold",
    lg: "text-2xl md:text-3xl font-bold",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Custom SVG health logo */}
      <div className={`relative ${sizeClasses[size]}`}>
        <svg
          viewBox="0 0 40 40"
          className={`${sizeClasses[size]} drop-shadow-md`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background circle */}
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="url(#gradient)"
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Medical cross */}
          <rect x="17" y="10" width="6" height="20" rx="3" fill="white" />
          <rect x="10" y="17" width="20" height="6" rx="3" fill="white" />

          {/* Heart shape */}
          <path
            d="M20 28c-1-1-8-6-8-11a4 4 0 0 1 8 0 4 4 0 0 1 8 0c0 5-7 10-8 11z"
            fill="#ef4444"
            fillOpacity="0.9"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}
