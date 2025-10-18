"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { Heart, Users, BookOpen, LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm clean-shadow border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-3 sm:py-4 md:py-6 px-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          )}
        </button>

        {/* Left side navigation - Desktop only */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <a
            href="/dashboard"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
          >
            <BookOpen className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Dashboard</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
          </a>
        </div>

        {/* Center logo - health-focused design */}
        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2">
          <Logo size="md" showText={true} />
        </div>

        {/* Right side navigation - Desktop only */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          <a
            href="/dashboard/mental-health"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
          >
            <Heart className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Quotes</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
          </a>

          <ThemeToggle />

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full border-2 border-destructive/20 transition-all duration-300 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:transform hover:scale-105"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile right side - Theme toggle only */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile menu - Improved Responsive Design */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${
          mobileMenuOpen
            ? "max-h-[400px] opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-4 sm:py-6 space-y-2 sm:space-y-4">
          <a
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-primary/5"
          >
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Dashboard</span>
          </a>

          <a
            href="/dashboard/mental-health"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-primary/5"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Quotes</span>
          </a>

          <a
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 text-sm sm:text-base font-medium text-muted-foreground hover:text-primary transition-colors py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-primary/5"
          >
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Profile</span>
          </a>

          <div className="pt-3 sm:pt-4 border-t border-border">
            {user ? (
              <Button
                variant="outline"
                size="default"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-full border-2 border-destructive/20 hover:border-destructive hover:bg-destructive/5 transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="outline"
                  size="default"
                  className="w-full rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 text-sm sm:text-base h-10 sm:h-11"
                >
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
