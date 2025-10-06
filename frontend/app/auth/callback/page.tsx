"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Confirming your email...");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Create SSR-compatible Supabase client for proper cookie handling
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Get the parameters from URL
        const code = searchParams.get("code");
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const error_code = searchParams.get("error_code");
        const error_description = searchParams.get("error_description");
        const next = searchParams.get("next") || "/dashboard";

        console.log("Callback params:", {
          code,
          token_hash,
          type,
          error_code,
          error_description,
          next,
        });

        // Check for errors first
        if (error_code || error_description) {
          console.error("Auth callback error:", {
            error_code,
            error_description,
          });
          setStatus("error");

          // Provide helpful messages based on error type
          if (error_code === "otp_expired") {
            setMessage(
              "This confirmation link has expired. Please register again or request a new confirmation email."
            );
          } else if (error_code === "access_denied") {
            setMessage(
              "Access denied. The confirmation link may be invalid or has already been used."
            );
          } else {
            setMessage(
              error_description?.replace(/\+/g, " ") ||
                "An error occurred during confirmation. Please try again."
            );
          }
          return;
        }

        // Handle PKCE flow (code-based)
        if (code) {
          console.log("Using PKCE flow with code exchange");

          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          console.log("Code exchange response:", { data, error });

          if (error) {
            console.error("Code exchange error:", error);
            setStatus("error");
            setMessage(
              "Confirmation link is invalid or has expired. Please try logging in or register again."
            );
            return;
          }

          if (data.session && data.user) {
            console.log("Email confirmed via PKCE:", {
              email: data.session.user.email,
              confirmed_at: data.user.confirmed_at,
            });

            // Create user profile if it doesn't exist
            const { data: existingProfile, error: profileCheckError } =
              await supabase
                .from("users")
                .select("id")
                .eq("id", data.session.user.id)
                .single();

            console.log("Profile check:", {
              existingProfile,
              profileCheckError,
            });

            if (!existingProfile && profileCheckError?.code === "PGRST116") {
              console.log("Creating user profile...");
              const { error: insertError } = await supabase
                .from("users")
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                });

              if (insertError) {
                console.error("Error creating profile:", insertError);
              } else {
                console.log("Profile created successfully");
              }
            }

            // Sign out the user so they must log in manually
            await supabase.auth.signOut();
            console.log("User signed out, redirecting to login");

            setStatus("success");
            setMessage(
              "Email confirmed successfully! Please log in with your credentials."
            );

            // Redirect to login page
            setTimeout(() => {
              console.log("Redirecting to login");
              router.push("/login");
            }, 2000);
            return;
          }
        }

        // Handle implicit flow (token_hash-based)
        if (token_hash && type) {
          // Exchange the token for a session
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as
              | "signup"
              | "email"
              | "recovery"
              | "invite"
              | "magiclink"
              | "email_change",
          });

          console.log("VerifyOtp response:", { data, error });

          if (error) {
            console.error("Verification error:", error);
            setStatus("error");
            setMessage(
              "Verification failed. The link may have expired. Please try registering again or contact support."
            );
            return;
          }

          if (data.session && data.user) {
            console.log("Session established:", {
              email: data.session.user.email,
              confirmed_at: data.user.confirmed_at,
            });

            // Create user profile if it doesn't exist
            const { data: existingProfile, error: profileCheckError } =
              await supabase
                .from("users")
                .select("id")
                .eq("id", data.session.user.id)
                .single();

            console.log("Profile check:", {
              existingProfile,
              profileCheckError,
            });

            if (!existingProfile && profileCheckError?.code === "PGRST116") {
              console.log("Creating user profile...");
              const { error: insertError } = await supabase
                .from("users")
                .insert({
                  id: data.session.user.id,
                  email: data.session.user.email,
                });

              if (insertError) {
                console.error("Error creating profile:", insertError);
              } else {
                console.log("Profile created successfully");
              }
            }

            // Sign out the user so they must log in manually
            await supabase.auth.signOut();
            console.log("User signed out, redirecting to login");

            setStatus("success");
            setMessage(
              "Email confirmed successfully! Please log in with your credentials."
            );

            // Redirect to login page
            setTimeout(() => {
              console.log("Redirecting to login");
              router.push("/login");
            }, 2000);
            return;
          } else {
            throw new Error("No session created after verification");
          }
        }

        // If no code or token_hash, check for existing session
        console.log("No code or token_hash, checking for existing session...");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        console.log("Existing session check:", {
          session: !!session,
          sessionError,
        });

        if (sessionError) {
          throw sessionError;
        }

        if (session) {
          console.log("Existing session found:", session.user.email);

          // Create user profile if it doesn't exist
          const { data: existingProfile, error: profileCheckError } =
            await supabase
              .from("users")
              .select("id")
              .eq("id", session.user.id)
              .single();

          if (!existingProfile && profileCheckError?.code === "PGRST116") {
            await supabase.from("users").insert({
              id: session.user.id,
              email: session.user.email,
            });
          }

          // Sign out the user so they must log in manually
          await supabase.auth.signOut();
          console.log("User signed out, redirecting to login");

          setStatus("success");
          setMessage(
            "Email confirmed successfully! Please log in with your credentials."
          );

          setTimeout(() => {
            console.log("Redirecting to login");
            router.push("/login");
          }, 2000);
        } else {
          console.log("No session found, user needs to log in");
          setStatus("success");
          setMessage("Email confirmed! Please log in with your credentials.");

          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (error: unknown) {
        console.error("Error confirming email:", error);
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An error occurred during confirmation. Please try logging in."
        );
      }
    };

    handleEmailConfirmation();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          {status === "loading" && (
            <Loader2 className="w-16 h-16 text-chart-1 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          )}
          {status === "error" && (
            <XCircle className="w-16 h-16 text-destructive" />
          )}
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            {status === "loading" && "Confirming Email"}
            {status === "success" && "Email Confirmed!"}
            {status === "error" && "Confirmation Failed"}
          </h1>
          <p className="text-muted-foreground">{message}</p>
        </div>

        {/* Action Button */}
        {status === "error" && (
          <div className="pt-6 space-y-3">
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
            </Button>
            <Button
              onClick={() => router.push("/register")}
              variant="outline"
              className="w-full"
            >
              Register Again
            </Button>
          </div>
        )}

        {status === "success" && (
          <div className="pt-6">
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-chart-1 animate-[loading_2s_ease-in-out]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-16 h-16 text-chart-1 animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
