"use client"

import { Heart, Brain, Dumbbell, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Heart,
      title: "Reduce Stress",
      description: "Studies show yoga reduces cortisol levels by up to 30%",
      color: "from-red-50 to-pink-50",
      iconColor: "text-red-500",
    },
    {
      icon: Brain,
      title: "Improve Sleep",
      description: "Meditation improves sleep quality and reduces insomnia",
      color: "from-purple-50 to-indigo-50",
      iconColor: "text-purple-500",
    },
    {
      icon: Dumbbell,
      title: "Build Strength",
      description: "Regular practice increases muscle tone and endurance",
      color: "from-orange-50 to-amber-50",
      iconColor: "text-orange-500",
    },
    {
      icon: Sparkles,
      title: "Mental Clarity",
      description: "Mindfulness enhances focus and cognitive performance",
      color: "from-cyan-50 to-teal-50",
      iconColor: "text-cyan-500",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Proven Health Benefits</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience transformative results backed by scientific research and thousands of success stories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className={`group relative overflow-hidden bg-gradient-to-br ${benefit.color} border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 p-8`}
            >
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
