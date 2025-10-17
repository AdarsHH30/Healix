"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Star, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Mitchell",
      age: 34,
      condition: "Chronic Stress",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      quote:
        "This platform helped me reduce my anxiety by 50%. The meditation programs are life-changing.",
      rating: 5,
      timeframe: "After 3 months",
      verified: true,
    },
    {
      name: "Marcus Johnson",
      age: 42,
      condition: "Back Pain",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      quote:
        "The yoga programs completely transformed my chronic back pain. I feel stronger and more flexible than ever.",
      rating: 5,
      timeframe: "After 2 months",
      verified: true,
    },
    {
      name: "Elena Rodriguez",
      age: 29,
      condition: "Sleep Issues",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      quote:
        "I struggled with insomnia for years. The mindfulness practices helped me finally get restful sleep.",
      rating: 5,
      timeframe: "After 6 weeks",
      verified: true,
    },
    {
      name: "David Chen",
      age: 38,
      condition: "Work Burnout",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      quote:
        "The mental health programs gave me tools to manage stress and find balance in my demanding career.",
      rating: 5,
      timeframe: "After 4 months",
      verified: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 md:mb-4">
            Real Results from Real People
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Join thousands who have transformed their health and wellness
            journey
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                  <Card className="clean-card p-6 md:p-8 lg:p-12">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                            <Image
                              src={
                                testimonial.image ||
                                "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                              }
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {testimonial.verified && (
                            <div className="absolute -bottom-2 -right-2 flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full bg-primary shadow-lg">
                              <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-1 mb-3 md:mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 md:h-5 md:w-5 text-primary fill-primary"
                            />
                          ))}
                        </div>

                        <blockquote className="text-lg md:text-xl lg:text-2xl text-foreground font-medium mb-4 md:mb-6 leading-relaxed">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4">
                          <div>
                            <p className="font-semibold text-sm md:text-base text-foreground">
                              {testimonial.name}, {testimonial.age}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {testimonial.condition}
                            </p>
                          </div>
                          <div className="hidden md:block w-px h-10 bg-border" />
                          <div className="flex items-center gap-2">
                            {testimonial.verified && (
                              <span className="text-xs font-medium text-primary">
                                Verified Member
                              </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {testimonial.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 md:mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-6 md:w-8 bg-primary"
                    : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
