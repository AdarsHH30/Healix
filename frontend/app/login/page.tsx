"use client";

import Image from "next/image";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { supabase } from "../../lib/supabase-client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, Suspense } from "react";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus(null);
    setResetError(null);

    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/reset-password`
          : undefined,
    });

    if (error) {
      setResetError(error.message);
    } else {
      setResetStatus("Password reset email sent! Please check your inbox.");
      setResetEmail("");
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowForgot(false);
        setResetStatus(null);
      }, 5000);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        if (authError.message.includes("Email not confirmed")) {
          setError(
            "Please confirm your email before logging in. Check your inbox."
          );
        } else if (authError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password.");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      if (authData.user && authData.session) {
        // Check if user profile exists, create if missing
        const { data: existingProfile } = await supabase
          .from("users")
          .select("id")
          .eq("id", authData.user.id)
          .single();

        if (!existingProfile) {
          await supabase.from("users").insert({
            id: authData.user.id,
            email: authData.user.email,
          });
        }

        // Small delay for session
        await new Promise((resolve) => setTimeout(resolve, 500));

        router.push(redirectTo);
        router.refresh();
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 px-4 sm:px-6 lg:px-8">
      <div className="w-full h-full grid lg:grid-cols-2 max-w-7xl">
        {/* --- Left Section --- */}
        <div className="max-w-md mx-auto w-full flex flex-col justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-10">
            <Logo className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed px-4">
              Sign in to access your personalized health dashboard
            </p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm">
              {error}
            </div>
          )}

          {/* --- Login Form --- */}
          <Form {...form}>
            <form
              className="space-y-4 sm:space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-11 sm:h-12 text-sm sm:text-base px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm sm:text-base font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="h-11 sm:h-12 text-sm sm:text-base px-3 sm:px-4 rounded-lg border-2 transition-all duration-200 focus:border-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full h-11 sm:h-12 text-sm sm:text-base font-semibold rounded-lg mt-6 sm:mt-8 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>

          {/* --- Forgot Password Section --- */}
          <div className="mt-6 sm:mt-8 space-y-4">
            <button
              type="button"
              onClick={() => setShowForgot(!showForgot)}
              className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline block w-full text-center"
            >
              Forgot your password?
            </button>

            {showForgot && (
              <div className="p-4 sm:p-6 rounded-lg bg-muted/50 border border-border space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-medium">
                    Reset Password
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                  </p>
                </div>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-10 sm:h-11 text-sm sm:text-base"
                  >
                    Send Reset Email
                  </Button>
                </form>

                {resetStatus && (
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-xs sm:text-sm">
                    {resetStatus}
                  </div>
                )}

                {resetError && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-xs sm:text-sm">
                    {resetError}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- Footer Links --- */}
          <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6 text-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline underline-offset-4 transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>

        {/* --- Right Section --- */}
        <div className="bg-muted hidden lg:block border-l relative overflow-hidden">
          <Image
            src="https://qvkzwudrgnyfwvvpfqxb.supabase.co/storage/v1/object/public/exercises/exercise-images/supasupa.png"
            alt="Healix"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
