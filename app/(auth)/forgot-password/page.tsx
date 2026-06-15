"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  authDescriptionClass,
  authErrorClass,
  authFooterClass,
  authFooterLinkClass,
  authHeadingClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
} from "@/components/auth/auth-ui";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  formatAuthError,
  formatSupabaseAuthError,
  getSupabaseConfigError,
} from "@/lib/supabase/config";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validations/auth";
import { SupabaseConfigBanner } from "@/components/supabase-config-banner";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    const configError = getSupabaseConfigError();
    if (configError) {
      toast({
        title: "Reset unavailable",
        description: configError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Could not send reset email",
          description: formatSupabaseAuthError(error.message, "reset"),
          variant: "destructive",
        });
        return;
      }

      setEmailSent(true);
      toast({
        title: "Check your email",
        description: "We sent a password reset link if an account exists for that address.",
      });
    } catch (err) {
      toast({
        title: "Could not send reset email",
        description: formatAuthError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SupabaseConfigBanner />
      <AuthLayout>
        <div className="mb-8">
          <h1 className={authHeadingClass}>Forgot password?</h1>
          <p className={authDescriptionClass}>
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        {emailSent ? (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              If <strong>{getValues("email")}</strong> is registered, you&apos;ll receive a
              reset link shortly. Check spam if you don&apos;t see it.
            </p>
            <Link href="/login" className={authFooterLinkClass}>
              Back to sign in
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="space-y-2">
              <Label htmlFor="email" className={authLabelClass}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className={authInputClass}
                {...register("email")}
              />
              {errors.email && (
                <p className={authErrorClass}>{errors.email.message}</p>
              )}
            </div>

            <button type="submit" className={authSubmitClass} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className={authFooterClass}>
          Remember your password?{" "}
          <Link href="/login" className={authFooterLinkClass}>
            Sign in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
