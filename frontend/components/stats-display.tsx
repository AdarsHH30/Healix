"use client";

import { useState, useEffect } from "react";
import { Activity, MapPin, Phone, Zap } from "lucide-react";

interface StatCardProps {
  value: string;
  label: string;
  color: "primary" | "accent" | "secondary";
  delay?: number;
  icon: React.ReactNode;
}

function StatCard({ value, label, color, delay = 0, icon }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const colorConfig = {
    primary: {
      text: "text-blue-600 dark:text-blue-400",
      border: "hover:border-blue-500/50",
      bg: "bg-blue-500/10",
      glow: "hover:shadow-blue-500/20",
    },
    accent: {
      text: "text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-500/50",
      bg: "bg-purple-500/10",
      glow: "hover:shadow-purple-500/20",
    },
    secondary: {
      text: "text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-500/50",
      bg: "bg-emerald-500/10",
      glow: "hover:shadow-emerald-500/20",
    },
  };

  const colors = colorConfig[color];

  return (
    <div
      className={`
        group relative overflow-hidden rounded-2xl 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        border border-gray-200 dark:border-gray-700
        p-6 text-center
        transition-all duration-500 ease-out
        hover:bg-white dark:hover:bg-gray-800
        hover:shadow-xl hover:scale-105 hover:-translate-y-1
        ${colors.border} ${colors.glow}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
      role="article"
      aria-label={`${label}: ${value}`}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} ${colors.text} mb-3 group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>

        {/* Value */}
        <div
          className={`text-4xl font-bold ${colors.text} mb-2 group-hover:scale-105 transition-transform duration-300`}
        >
          {value}
        </div>

        {/* Label */}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {label}
        </div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

export function StatsDisplay() {
  const stats = [
    {
      value: "24/7",
      label: "Emergency Support",
      color: "primary" as const,
      icon: <Activity className="w-6 h-6" />,
      delay: 0,
    },
    {
      value: "AI",
      label: "First Aid Assistant",
      color: "accent" as const,
      icon: <Zap className="w-6 h-6" />,
      delay: 100,
    },
    {
      value: "Map",
      label: "Hospital Locator",
      color: "secondary" as const,
      icon: <MapPin className="w-6 h-6" />,
      delay: 200,
    },
    {
      value: "Instant",
      label: "Emergency Contacts",
      color: "primary" as const,
      icon: <Phone className="w-6 h-6" />,
      delay: 300,
    },
  ];

  return (
    <section
      className="w-full max-w-7xl mx-auto px-4"
      aria-label="Emergency services statistics"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={`${stat.label}-${index}`}
            value={stat.value}
            label={stat.label}
            color={stat.color}
            delay={stat.delay}
            icon={stat.icon}
          />
        ))}
      </div>
    </section>
  );
}
