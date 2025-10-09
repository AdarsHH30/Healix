"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function VisualHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }));
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16">
      <div
        className={`relative grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Emergency Services Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-primary/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent z-10 group-hover:from-primary/20 transition-all duration-700" />
          {!imageErrors.emergency ? (
            <Image
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
              alt="Emergency Medical Services"
              width={400}
              height={400}
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              priority
              onError={() => handleImageError("emergency")}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-[300px] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl">🚨</span>
                </div>
                <p className="text-primary font-medium">Emergency Services</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              Emergency Support
            </h3>
            <p className="text-white/90 text-sm">
              Instant access when you need it most
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary/60 animate-pulse z-20" />
        </div>

        {/* First Aid Training Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-accent/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent z-10 group-hover:from-accent/20 transition-all duration-700" />
          {!imageErrors.firstaid ? (
            <Image
              src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
              alt="First Aid Training"
              width={400}
              height={400}
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              onError={() => handleImageError("firstaid")}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-[300px] bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-2xl">🩹</span>
                </div>
                <p className="text-accent font-medium">First Aid Guidance</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              First Aid Guidance
            </h3>
            <p className="text-white/90 text-sm">
              AI-powered emergency assistance
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-accent/60 animate-pulse z-20" />
        </div>

        {/* Hospital Locator Image */}
        <div className="relative group overflow-hidden rounded-3xl shadow-2xl hover:shadow-secondary/30 transition-all duration-700 hover:scale-[1.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent z-10 group-hover:from-secondary/20 transition-all duration-700" />
          {!imageErrors.hospital ? (
            <Image
              src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=400&q=80"
              alt="Hospital Location Map"
              width={400}
              height={400}
              className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              onError={() => handleImageError("hospital")}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGBkbHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          ) : (
            <div className="w-full h-[300px] bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
                <p className="text-secondary font-medium">Hospital Locator</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <h3 className="text-white font-semibold text-xl mb-1">
              Hospital Locator
            </h3>
            <p className="text-white/90 text-sm">
              Find nearby hospitals instantly
            </p>
          </div>
          <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-secondary/60 animate-pulse z-20" />
        </div>
      </div>
    </div>
  );
}
