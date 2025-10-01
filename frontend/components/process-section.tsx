"use client"

import { Compass, Users, TrendingUp } from "lucide-react"

export function ProcessSection() {
  const steps = [
    {
      number: "01",
      icon: Compass,
      title: "Choose Your Path",
      description: "Select from yoga, meditation, or fitness programs tailored to your goals and experience level",
    },
    {
      number: "02",
      icon: Users,
      title: "Follow Expert Guidance",
      description: "Learn from certified instructors with personalized video tutorials and live sessions",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Track Your Progress",
      description: "Monitor your wellness journey with insights, achievements, and community support",
    },
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wellness-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wellness-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start your wellness journey in three simple steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/30">
                        <step.icon className="h-10 w-10 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white border-4 border-background shadow-lg">
                        <span className="text-sm font-bold text-primary">{step.number}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-semibold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center my-8">
                      <div className="w-1 h-12 bg-gradient-to-b from-primary to-accent rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
