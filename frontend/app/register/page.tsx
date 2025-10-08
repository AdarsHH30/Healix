"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { MessageCircle, MapPin, CheckCircle2 } from "lucide-react";

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    emergencyPhone1: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
    emergencyPhone2: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      emergencyPhone1: "",
      emergencyPhone2: "",
    },
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create SSR-compatible Supabase client for proper cookie handling
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: {
            emergency_phone_1: data.emergencyPhone1,
            emergency_phone_2: data.emergencyPhone2,
          },
        },
      });

      console.log("Sign up response:", { authData, authError });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Check if the user has an existing session or needs to confirm email
        const identities = authData.user.identities;

        console.log("User identities:", identities);
        console.log("User confirmed at:", authData.user.confirmed_at);
        console.log("Session exists:", !!authData.session);

        if (identities && identities.length === 0) {
          // User already exists but hasn't confirmed email
          setError(
            "This email is already registered. Please check your email for the confirmation link, or try logging in if you've already confirmed your account."
          );
          form.reset();
          return;
        }

        if (authData.session && authData.user.confirmed_at) {
          // Email confirmation is disabled in Supabase - user is already logged in
          console.log("Auto-confirmed user, redirecting to dashboard");

          // Create user profile
          const { error: profileError } = await supabase.from("users").upsert(
            {
              id: authData.user.id,
              email: data.email,
              emergency_phone_1: data.emergencyPhone1 || null,
              emergency_phone_2: data.emergencyPhone2 || null,
            },
            {
              onConflict: "id",
            }
          );

          if (profileError) {
            console.error("Error creating user profile:", profileError);
          }

          setSuccess(
            "Account created successfully! Redirecting to dashboard..."
          );
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          // Email confirmation is required
          console.log("Email confirmation required");
          setSuccess(
            "🎉 Registration successful! Please check your email inbox and click the confirmation link to verify your account. Don't forget to check your spam folder if you don't see it."
          );

          // Clear the form
          form.reset();

          // Sign out the user to ensure they must confirm email before logging in
          await supabase.auth.signOut();
        }
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Logo className="h-12 w-12 mx-auto" />
          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Join Healix to access emergency resources and save important
            contacts
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm space-y-2">
              <p className="font-semibold">{success}</p>
              <p className="text-xs">
                After confirming your email, you can{" "}
                <Link
                  href="/login"
                  className="underline font-medium hover:text-green-700 dark:hover:text-green-300"
                >
                  log in here
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Form Card */}
        {!success && (
          <div className="bg-card border rounded-lg shadow-sm p-8">
            <Form {...form}>
              <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {/* Account Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Account Information</h2>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your.email@example.com"
                            className="h-11"
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
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Create a strong password"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Emergency Contacts */}
                <div className="space-y-4 pt-6 border-t">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Emergency Contacts
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add phone numbers we can call in case of emergency
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="emergencyPhone1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Emergency Contact</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyPhone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Emergency Contact</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="+1 (555) 987-6543"
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* Success message with login link */}
        {success && (
          <div className="bg-card border rounded-lg shadow-sm p-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Check Your Email!</h2>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation link to your email address.
                Please click the link to verify your account.
              </p>
            </div>
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-xs text-muted-foreground px-8">
            By creating an account, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
          <p className="text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-40 flex flex-col gap-3 md:gap-4">
        {/* Map Button */}
        <button
          onClick={() => setIsMapOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-2 to-chart-4 text-white rounded-full shadow-2xl hover:shadow-chart-2/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Hospital Map"
        >
          <MapPin size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>

        {/* Chatbot Button */}
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-chart-1 to-chart-2 text-white rounded-full shadow-2xl hover:shadow-chart-1/50 transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={24} strokeWidth={2} className="md:w-7 md:h-7" />
        </button>
      </div>

      {/* Chatbot & Map Popups */}
      <ChatbotPopup
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
      <MapPopup isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
    </div>
  );
};

export default RegisterPage;
