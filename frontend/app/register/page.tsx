"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import { ChatbotPopup } from "@/components/chatbot-popup";
import { MapPopup } from "@/components/map-popup";
import { SignupForm, formSchema, FormData } from "@/components/signup-form";
import { MessageCircle, MapPin } from "lucide-react";

const RegisterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      emergencyPhone1: "",
      emergencyPhone2: "",
    },
    resolver: zodResolver(formSchema),
    mode: "onSubmit", // Validate only on submit
    reValidateMode: "onChange", // Re-validate on change after first submit
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create SSR-compatible Supabase client for proper cookie handling
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Sign up the user (disable email confirmation by setting emailRedirectTo and autoConfirm)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/login`,
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            emergency_phone_1: data.emergencyPhone1 || null,
            emergency_phone_2: data.emergencyPhone2 || null,
          },
        },
      });

      console.log("Sign up response:", { authData, authError });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user) {
        // Check if the user already exists
        const identities = authData.user.identities;

        if (identities && identities.length === 0) {
          // User already exists
          setError(
            "This email is already registered. Please try logging in instead."
          );
          form.reset();
          return;
        }

        // Create user profile in database
        console.log("Creating user profile with data:", {
          id: authData.user.id,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          emergency_phone_1: data.emergencyPhone1,
          emergency_phone_2: data.emergencyPhone2,
        });

        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .upsert(
            {
              id: authData.user.id,
              email: data.email,
              first_name: data.firstName || null,
              last_name: data.lastName || null,
              emergency_phone_1: data.emergencyPhone1 || null,
              emergency_phone_2: data.emergencyPhone2 || null,
            },
            {
              onConflict: "id",
            }
          )
          .select();

        console.log("Profile creation result:", { profileData, profileError });

        if (profileError) {
          console.error("Error creating user profile:", profileError);
          // Don't fail registration if profile creation fails
        }

        // Sign out the user immediately after registration
        await supabase.auth.signOut();

        // Show success message and redirect to login
        setSuccess("Account created successfully! Redirecting to login...");

        // Clear the form
        form.reset();

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center py-1 px-4">
      <div className="max-w-2xl w-full space-y-0">
        {/* Header */}
        <div className="text-center space-y-0">
          <div className="flex justify-center">
            {/* <div className="p-3 bg-primary/10 rounded-2xl">
              <Logo className="h-12 w-12" />
            </div> */}
          </div>

          {/* <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Join Healix
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your trusted companion for emergency resources and health support
            </p>
          </div> */}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm text-center">
              <p className="font-semibold">{success}</p>
            </div>
          )}
        </div>

        {/* Form Card - Always show unless redirecting */}
        <SignupForm form={form} onSubmit={onSubmit} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
            </p>

            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Sign in here →
              </Link>
            </div>
          </div>
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
