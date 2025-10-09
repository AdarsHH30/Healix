"use client";

import { Phone, MessageSquare, MapPin } from "lucide-react";

export function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: Phone,
      title: "Emergency Contact",
      description: "One-tap access to emergency services",
    },
    {
      number: "02",
      icon: MessageSquare,
      title: "AI First Aid",
      description: "Instant step-by-step guidance",
    },
    {
      number: "03",
      icon: MapPin,
      title: "Locate Help",
      description: "Find nearby medical facilities",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Help in three simple steps
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
            {/* Connection line for desktop */}
            <div
              className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary opacity-20"
              style={{ top: "3rem" }}
            />

            {steps.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{
                  animation: "fadeInUp 0.6s ease-out forwards",
                  animationDelay: `${index * 150}ms`,
                  opacity: 0,
                }}
              >
                <div className="relative p-8 rounded-2xl border border-border/50 bg-background hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                  {/* Number badge */}
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="text-sm font-bold text-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300">
                      <step.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
