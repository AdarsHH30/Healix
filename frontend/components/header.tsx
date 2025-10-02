"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Leaf, Heart, Users, BookOpen, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Check current auth state
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? "bg-background/80 backdrop-blur-xl shadow-lg shadow-primary/5 dark:bg-background/90"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between py-6 px-4">
        {/* Left side navigation */}
        <div className="flex items-center gap-8">
          <a
            href="#programs"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
          >
            <BookOpen className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Programs</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
          </a>

          <a
            href="#instructors"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
          >
            <Heart className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Instructors</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
          </a>
        </div>

        {/* Center logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Leaf className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Holistic Wellness
          </span>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center gap-8">
          <a
            href="#community"
            className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all duration-300 relative"
          >
            <Users className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            <span>Community</span>
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
          </a>

          <ThemeToggle />

          {user ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="rounded-full border-2 border-destructive/20 hover:border-destructive hover:bg-destructive/5 transition-all duration-300 bg-transparent"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
