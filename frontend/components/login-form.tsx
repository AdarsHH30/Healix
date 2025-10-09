import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-[80vh] items-center justify-center p-4",
        className
      )}
      {...props}
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-8">
          <form className="flex flex-col gap-6">
            <div className="text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Welcome back 👋
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in to continue to your account
              </p>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-sm text-primary underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-base">
              Login
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <a href="#" className="text-primary underline underline-offset-4">
                Sign up
              </a>
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-6 text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By continuing, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </p>
    </div>
  );
}
