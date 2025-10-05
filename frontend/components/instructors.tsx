"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Clock } from "lucide-react";

export function Instructors() {
  const instructors = [
    {
      name: "Dr. Maya Patel",
      credentials: "PhD, Certified Yoga Therapist",
      specialization: "Trauma-informed yoga, PTSD recovery",
      experience: "15 years",
      students: "5,000+",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop&crop=face",
    },
    {
      name: "James Wilson",
      credentials: "Licensed Mental Health Counselor",
      specialization: "Mindfulness, anxiety management",
      experience: "12 years",
      students: "3,500+",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face",
    },
    {
      name: "Sarah Chen",
      credentials: "Certified Personal Trainer, RYT-500",
      specialization: "Strength training, holistic fitness",
      experience: "10 years",
      students: "4,200+",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=400&fit=crop&crop=face",
    },
    {
      name: "Dr. Marcus Thompson",
      credentials: "MD, Integrative Medicine Specialist",
      specialization: "Stress reduction, chronic pain",
      experience: "18 years",
      students: "6,000+",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Meet Our Expert Instructors
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Learn from certified professionals dedicated to your wellness
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
          {instructors.map((instructor, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden bg-white border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative h-56 md:h-64 overflow-hidden">
                <img
                  src={
                    instructor.image ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=instructor"
                  }
                  alt={instructor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4">
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-1">
                    {instructor.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/90">
                    {instructor.credentials}
                  </p>
                </div>
              </div>

              <div className="p-4 md:p-6">
                <div className="mb-3 md:mb-4">
                  <p className="text-xs md:text-sm font-medium text-foreground mb-1">
                    Specializes in:
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {instructor.specialization}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    <span>{instructor.experience}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                    <span>{instructor.students}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full text-sm md:text-base rounded-full border-primary/30 hover:bg-primary/5 hover:border-primary transition-all duration-300 group/btn bg-transparent"
                >
                  View Profile
                  <Award className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4 group-hover/btn:rotate-12 transition-transform" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
