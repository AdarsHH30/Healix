"use client";

import type React from "react";

import { Logo } from "@/components/logo";
import { Facebook, Instagram, Youtube, Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/20 border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <Logo size="md" showText={true} />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering your journey to complete wellness through expert-guided
              health and fitness programs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-base text-foreground mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-base text-foreground mb-4">
              Follow Us
            </h3>
            <div className="flex items-center gap-3">
              <a
                href="#instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#youtube"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-300"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Healix. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center">
              <strong>Disclaimer:</strong> Content is for informational purposes
              only. Consult healthcare providers before starting any wellness
              program.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
