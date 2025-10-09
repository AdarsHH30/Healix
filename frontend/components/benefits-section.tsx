"use client";

import { Heart, Brain, Dumbbell, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Heart,
      title: "Reduce Stress",
      description: "Studies show yoga reduces cortisol levels by up to 30%",
    },
    {
      icon: Brain,
      title: "Improve Sleep",
      description: "Meditation improves sleep quality and reduces insomnia",
    },
    {
      icon: Dumbbell,
      title: "Build Strength",
      description: "Regular practice increases muscle tone and endurance",
    },
    {
      icon: Sparkles,
      title: "Mental Clarity",
      description: "Mindfulness enhances focus and cognitive performance",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Proven Health Benefits
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Experience transformative results backed by scientific research and
            thousands of success stories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="clean-card clean-hover p-6 md:p-8 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg bg-accent/10">
                  <benefit.icon className="h-6 w-6 md:h-7 md:w-7 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
