"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthConfirmPage() {
  const router = useRouter();

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, 'Session:', session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        // User successfully confirmed email and signed in
        console.log('User signed in, creating profile...');
        
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

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 border-4 border-chart-1/30 border-t-chart-1 rounded-full animate-spin" />
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-foreground">
            Confirming your email...
          </h1>
          <p className="text-muted-foreground">
            Please wait while we verify your account.
          </p>
        </div>
      </div>
    </div>
  );
}
