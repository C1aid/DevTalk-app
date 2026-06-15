"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  authDescriptionClass,
  authErrorClass,
  authFooterClass,
  authFooterLinkClass,
  authHeadingClass,
  authLabelClass,
  authSubmitClass,
} from "@/components/auth/auth-ui";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  formatAuthError,
  formatSupabaseAuthError,
  getSupabaseConfigError,
} from "@/lib/supabase/config";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validations/auth";
import { SupabaseConfigBanner } from "@/components/supabase-config-banner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setIsReady(!!session);
    });
  }, []);

  const onSubmit = async (data: ResetPasswordInput) => {
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
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast({
          title: "Could not reset password",
          description: formatSupabaseAuthError(error.message, "reset"),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password updated",
        description: "You can now sign in with your new password.",
      });
      router.push("/channels");
      router.refresh();
    } catch (err) {
      toast({
        title: "Could not reset password",
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
          <h1 className={authHeadingClass}>Set a new password</h1>
          <p className={authDescriptionClass}>
            Choose a new password for your DevTalk account.
          </p>
        </div>

        {!isReady ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Open the reset link from your email to continue. If the link expired, request a
              new one.
            </p>
            <Link href="/forgot-password" className={authFooterLinkClass}>
              Request new reset link
            </Link>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
            <div className="space-y-2">
              <Label htmlFor="password" className={authLabelClass}>
                New password
              </Label>
              <PasswordInput id="password" {...register("password")} />
              {errors.password && (
                <p className={authErrorClass}>{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={authLabelClass}>
                Confirm password
              </Label>
              <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
              {errors.confirmPassword && (
                <p className={authErrorClass}>{errors.confirmPassword.message}</p>
              )}
            </div>

            <button type="submit" className={authSubmitClass} disabled={isLoading}>
              {isLoading ? "Saving..." : "Update password"}
            </button>
          </form>
        )}

        <p className={authFooterClass}>
          <Link href="/login" className={authFooterLinkClass}>
            Back to sign in
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}
