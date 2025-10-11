"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Suspense } from "react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const code = searchParams.get("code");
      const error_code = searchParams.get("error_code");

      if (error_code) {
        router.push("/login?error=confirmation_failed");
        return;
      }

      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (!error && data.session) {
            const { data: existingProfile } = await supabase
              .from("users")
              .select("id")
              .eq("id", data.session.user.id)
              .single();

            if (!existingProfile) {
              await supabase.from("users").insert({
                id: data.session.user.id,
                email: data.session.user.email,
              });
            }

            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Callback error:", error);
        }
      }

      router.push("/login");
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
