"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Shield,
  Lock,
  Mail,
} from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-muted/30 to-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
          {/* About Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                <Leaf className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Healix
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed mb-6 max-w-md">
              Empowering your journey to complete wellness through expert-guided
              yoga, meditation, and fitness programs. Transform your life with
              science-backed practices and certified instructors.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-full bg-primary/10">
                <Shield className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
                <span className="text-xs font-medium text-primary">
                  SSL Secure
                </span>
              </div>
              <div className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-full bg-accent/10">
                <Lock className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                <span className="text-xs font-medium text-accent">
                  Privacy Protected
                </span>
              </div>
            </div>
          </div>

          {/* Programs Column */}
          <div>
            <h3 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">
              Programs
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="#yoga"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Yoga Classes
                </a>
              </li>
              <li>
                <a
                  href="#meditation"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Meditation
                </a>
              </li>
              <li>
                <a
                  href="#fitness"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Physical Fitness
                </a>
              </li>
              <li>
                <a
                  href="#mental-health"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Mental Health
                </a>
              </li>
              <li>
                <a
                  href="#nutrition"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Nutrition Guidance
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">
              Resources
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="#blog"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Blog & Articles
                </a>
              </li>
              <li>
                <a
                  href="#research"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Research & Studies
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#accessibility"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-sm md:text-base text-foreground mb-3 md:mb-4">
              Support
            </h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <a
                  href="#contact"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#help"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#community"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Community Forum
                </a>
              </li>
              <li>
                <a
                  href="#instructors"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Become an Instructor
                </a>
              </li>
              <li>
                <a
                  href="#partnerships"
                  className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Partnerships
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-border pt-8 md:pt-12 pb-6 md:pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2 md:mb-3">
              <Mail className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <h3 className="text-lg md:text-xl font-semibold text-foreground">
                Join Our Wellness Community
              </h3>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 px-4">
              Get weekly wellness tips, exclusive content, and early access to
              new programs
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border-border focus:border-primary transition-colors text-sm"
                required
              />
              <Button
                type="submit"
                className="rounded-full px-6 md:px-8 text-sm md:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3 px-4">
              Unsubscribe anytime. We respect your privacy and never share your
              data.
            </p>
          </div>
        </div>

        {/* Social Media & Bottom Section */}
        <div className="border-t border-border pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <a
                href="#instagram"
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="#facebook"
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="#youtube"
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4 md:h-5 md:w-5" />
              </a>
              <a
                href="#twitter"
                className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4 md:h-5 md:w-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs text-muted-foreground">
              <a href="#terms" className="hover:text-primary transition-colors">
                Terms of Service
              </a>
              <span>•</span>
              <a
                href="#privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="#cookies"
                className="hover:text-primary transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="mt-6 md:mt-8 p-3 md:p-4 rounded-xl md:rounded-2xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              <strong className="text-foreground">Medical Disclaimer:</strong>{" "}
              The content provided on this platform is for informational and
              educational purposes only. It is not intended as a substitute for
              professional medical advice, diagnosis, or treatment. Always
              consult your physician or qualified healthcare provider before
              starting any wellness program, especially if you have pre-existing
              health conditions.
            </p>
          </div>

          {/* Copyright */}
          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-muted-foreground">
              © {new Date().getFullYear()} Healix. All rights reserved. Made
              with care for your wellbeing.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
