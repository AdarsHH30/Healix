"use client";

import { CheckCircle2, Shield, Clock, Users } from "lucide-react";

export function CredentialsBar() {
  const credentials = [
    {
      icon: Clock,
      text: "24/7 Available",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      icon: Shield,
      text: "Expert Verified",
      color: "from-emerald-500/20 to-green-500/20",
    },
    {
      icon: CheckCircle2,
      text: "Instant Response",
      color: "from-violet-500/20 to-purple-500/20",
    },
    {
      icon: Users,
      text: "Trusted by 10K+",
      color: "from-orange-500/20 to-red-500/20",
    },
  ];

  return (
    <section className="py-6 md:py-10 relative overflow-hidden border-y border-border/30">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {credentials.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 group cursor-default"
              style={{
                animation: "fadeIn 0.5s ease-out forwards",
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              {/* Icon container with unique gradient */}
              <div
                className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl`}
              >
                <item.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors duration-300" />

                {/* Pulse effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/20 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>

              {/* Text with better typography */}
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 tracking-tight">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
