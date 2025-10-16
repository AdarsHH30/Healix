"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconUser,
  IconMail,
  IconLock,
  IconPhone,
} from "@tabler/icons-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

const formSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .min(2, "First name must be at least 2 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .min(2, "Last name must be at least 2 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .min(8, "Password must be at least 8 characters long"),
    emergencyPhone1: z
      .string()
      .min(1, "Primary emergency contact is required")
      .refine(
        (val) => {
          if (!val || val.trim() === "") return false;
          const digitsOnly = val.replace(/[\s\-\+\(\)]/g, "");
          return digitsOnly.length >= 10 && /^[0-9]+$/.test(digitsOnly);
        },
        {
          message: "Please enter a valid phone number (at least 10 digits)",
        }
      ),
    emergencyPhone2: z
      .string()
      .min(1, "Secondary emergency contact is required")
      .refine(
        (val) => {
          if (!val || val.trim() === "") return false;
          const digitsOnly = val.replace(/[\s\-\+\(\)]/g, "");
          return digitsOnly.length >= 10 && /^[0-9]+$/.test(digitsOnly);
        },
        {
          message: "Please enter a valid phone number (at least 10 digits)",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

interface SignupFormProps {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export function SignupForm({ form, onSubmit, isLoading }: SignupFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Manually trigger validation and submission
    form.handleSubmit(
      (data) => {
        onSubmit(data);
      },
      (errors) => {
      }
    )(e);
  };

  return (
    <div className="shadow-input mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 dark:bg-black/50 border border-white/10">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Welcome to Healix
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Create your account to access emergency resources and health support
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        {/* Name Fields */}
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstName" className="flex items-center gap-2">
              <IconUser className="w-4 h-4" />
              First name
            </Label>
            <Input
              id="firstName"
              placeholder="John"
              type="text"
              className="h-11"
              {...form.register("firstName")}
            />
            {form.formState.errors.firstName && (
              <p className="text-xs text-red-500">
                {form.formState.errors.firstName.message}
              </p>
            )}
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName" className="flex items-center gap-2">
              <IconUser className="w-4 h-4" />
              Last name
            </Label>
            <Input
              id="lastName"
              placeholder="Doe"
              type="text"
              className="h-11"
              {...form.register("lastName")}
            />
            {form.formState.errors.lastName && (
              <p className="text-xs text-red-500">
                {form.formState.errors.lastName.message}
              </p>
            )}
          </LabelInputContainer>
        </div>

        {/* Email */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="flex items-center gap-2">
            <IconMail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="email"
            placeholder="your.email@example.com"
            type="email"
            className="h-11"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </LabelInputContainer>

        {/* Password */}
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="flex items-center gap-2">
            <IconLock className="w-4 h-4" />
            Password
          </Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            className="h-11"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </LabelInputContainer>

        {/* Confirm Password */}
        <LabelInputContainer className="mb-6">
          <Label htmlFor="confirmPassword" className="flex items-center gap-2">
            <IconLock className="w-4 h-4" />
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            className="h-11"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </LabelInputContainer>

        {/* Emergency Contacts Section */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-muted-foreground/20">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <IconPhone className="w-5 h-5 text-primary" />
            Emergency Contacts
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Add trusted contacts we can reach in emergencies{" "}
            <span className="text-red-500 font-semibold">(Required)</span>
          </p>

          <LabelInputContainer className="mb-4">
            <Label
              htmlFor="emergencyPhone1"
              className="flex items-center gap-2"
            >
              <IconPhone className="w-4 h-4" />
              Primary Emergency Contact{" "}
              <span className="text-xs text-red-500">*</span>
            </Label>
            <Input
              id="emergencyPhone1"
              placeholder="+91 9887654321"
              type="tel"
              className="h-11"
              {...form.register("emergencyPhone1")}
            />
            {form.formState.errors.emergencyPhone1 && (
              <p className="text-xs text-red-500">
                {form.formState.errors.emergencyPhone1.message}
              </p>
            )}
          </LabelInputContainer>

          <LabelInputContainer>
            <Label
              htmlFor="emergencyPhone2"
              className="flex items-center gap-2"
            >
              <IconPhone className="w-4 h-4" />
              Secondary Emergency Contact{" "}
              <span className="text-xs text-red-500">*</span>
            </Label>
            <Input
              id="emergencyPhone2"
              placeholder="+91 9887654321"
              type="tel"
              className="h-11"
              {...form.register("emergencyPhone2")}
            />
            {form.formState.errors.emergencyPhone2 && (
              <p className="text-xs text-red-500">
                {form.formState.errors.emergencyPhone2.message}
              </p>
            )}
          </LabelInputContainer>
        </div>

        {/* Submit Button */}
        <button
          className="group/btn relative block h-12 w-full rounded-md bg-gradient-to-br from-primary to-primary/70 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Creating Account...
            </>
          ) : (
            <>Sign up &rarr;</>
          )}
          <BottomGradient />
        </button>

        {/* Divider */}
        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export { formSchema };
export type { FormData };
