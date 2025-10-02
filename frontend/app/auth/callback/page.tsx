"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
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
        // Get the token from URL parameters
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");

        console.log("Callback params:", { token_hash, type });

        if (token_hash && type) {
          // Exchange the token for a session
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as
              | "signup"
              | "email"
              | "recovery"
              | "invite"
              | "magiclink",
          });

          if (error) {
            console.error("Verification error:", error);
            throw error;
          }

          if (data.session) {
            console.log("Session established:", data.session.user.email);

            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from("users")
              .select("id")
              .eq("id", data.session.user.id)
              .single();

            if (!existingProfile) {
              console.log("Creating user profile...");
              await supabase.from("users").insert({
                id: data.session.user.id,
                email: data.session.user.email,
              });
            }

            setStatus("success");
            setMessage(
              "Email confirmed successfully! Redirecting to dashboard..."
            );

            // Redirect after 2 seconds
            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 2000);
          } else {
            throw new Error("No session created after verification");
          }
        } else {
          // Fallback: try to get existing session
          const {
            data: { session },
            error,
          } = await supabase.auth.getSession();

          if (error) {
            throw error;
          }

          if (session) {
            // Create user profile if it doesn't exist
            const { data: existingProfile } = await supabase
              .from("users")
              .select("id")
              .eq("id", session.user.id)
              .single();

            if (!existingProfile) {
              await supabase.from("users").insert({
                id: session.user.id,
                email: session.user.email,
              });
            }

            setStatus("success");
            setMessage(
              "Email confirmed successfully! Redirecting to dashboard..."
            );

            setTimeout(() => {
              router.push("/dashboard");
              router.refresh();
            }, 2000);
          } else {
            setStatus("error");
            setMessage(
              "Email confirmed! You can now log in with your credentials."
            );
          }
        }
      } catch (error: unknown) {
        console.error("Error confirming email:", error);
        setStatus("error");
        setMessage("Email confirmed! Please log in to continue.");
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
          <div className="pt-6">
            <Button onClick={() => router.push("/login")} className="w-full">
              Go to Login
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
