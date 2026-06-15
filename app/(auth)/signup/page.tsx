"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthDivider,
  OAuthButtons,
  authCheckboxClass,
  authCheckboxLabelClass,
  authDescriptionClass,
  authErrorClass,
  authFooterClass,
  authFooterLinkClass,
  authHeadingClass,
  authInputClass,
  authLabelClass,
  authLegalClass,
  authSubmitClass,
} from "@/components/auth/auth-ui";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  formatAuthError,
  formatSupabaseAuthError,
  getSupabaseConfigError,
} from "@/lib/supabase/config";
import { signupSchema, type SignupInput } from "@/lib/validations/auth";
import { SupabaseConfigBanner } from "@/components/supabase-config-banner";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [updatesOptIn, setUpdatesOptIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const signInWithOAuth = async (provider: "google" | "github") => {
    const configError = getSupabaseConfigError();
    if (configError) {
      toast({
        title: "Sign up unavailable",
        description: configError,
        variant: "destructive",
      });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/channels`,
      },
    });

    if (error) {
      toast({
        title: "OAuth failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: SignupInput) => {
    const configError = getSupabaseConfigError();
    if (configError) {
      toast({
        title: "Sign up unavailable",
        description: configError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.name,
            updates_opt_in: updatesOptIn,
          },
        },
      });

      if (error) {
        toast({
          title: "Sign up failed",
          description: formatSupabaseAuthError(error.message, "signup"),
          variant: "destructive",
        });
        return;
      }

      if (!authData.session) {
        toast({
          title: "Confirm your email",
          description: "We sent a confirmation link. Sign in after confirming your email.",
        });
        router.push("/login");
        return;
      }

      toast({
        title: "Account created",
        description: "Welcome to DevTalk.",
      });
      router.push("/channels");
      router.refresh();
    } catch (err) {
      toast({
        title: "Sign up failed",
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
          <h1 className={authHeadingClass}>Create an account</h1>
          <p className={authDescriptionClass}>
            Get started with DevTalk in minutes.
          </p>
        </div>

        <OAuthButtons
          onGoogle={() => void signInWithOAuth("google")}
          onGithub={() => void signInWithOAuth("github")}
        />

        <AuthDivider />

        <form className="space-y-5" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className={authLabelClass}>
                Name
              </Label>
              <Input
                id="name"
                placeholder="John Doe"
                className={authInputClass}
                {...register("name")}
              />
              {errors.name && (
                <p className={authErrorClass}>{errors.name.message}</p>
              )}
            </div>
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
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password" className={authLabelClass}>
                Password
              </Label>
              <PasswordInput
                id="password"
                className={authInputClass}
                {...register("password")}
              />
              {errors.password && (
                <p className={authErrorClass}>{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={authLabelClass}>
                Confirm Password
              </Label>
              <PasswordInput
                id="confirmPassword"
                className={authInputClass}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className={authErrorClass}>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={updatesOptIn}
              onChange={(e) => setUpdatesOptIn(e.target.checked)}
              className={authCheckboxClass}
            />
            <span className={authCheckboxLabelClass}>
              Know when we release new integrations and models.
            </span>
          </label>

          <button type="submit" className={authSubmitClass} disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={authFooterClass}>
          Already have an account?{" "}
          <Link href="/login" className={authFooterLinkClass}>
            Sign in
          </Link>
        </p>

        <p className={`mt-8 text-center ${authLegalClass}`}>
          By continuing, you agree to our{" "}
          <Link href="/terms-of-service" className="underline hover:text-zinc-900">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-zinc-900">
            Privacy Policy
          </Link>
          .
        </p>
      </AuthLayout>
    </>
  );
}
