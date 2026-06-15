"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  AuthDivider,
  OAuthButtons,
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
import { getSafeRedirect } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/client";
import {
  formatAuthError,
  formatSupabaseAuthError,
  getSupabaseConfigError,
} from "@/lib/supabase/config";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { SupabaseConfigBanner } from "@/components/supabase-config-banner";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const redirect = getSafeRedirect(searchParams.get("redirect"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (searchParams.get("error") === "auth_callback_error") {
      toast({
        title: "Sign in failed",
        description: "Could not complete authentication. Please try again.",
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  const signInWithOAuth = async (provider: "google" | "github") => {
    const configError = getSupabaseConfigError();
    if (configError) {
      toast({
        title: "Sign in unavailable",
        description: configError,
        variant: "destructive",
      });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
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

  const onSubmit = async (data: LoginInput) => {
    const configError = getSupabaseConfigError();
    if (configError) {
      toast({
        title: "Sign in unavailable",
        description: configError,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast({
          title: "Sign in failed",
          description: formatSupabaseAuthError(error.message, "login"),
          variant: "destructive",
        });
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast({
        title: "Sign in failed",
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
          <h1 className={authHeadingClass}>Welcome back</h1>
          <p className={authDescriptionClass}>
            Sign in to your DevTalk account.
          </p>
        </div>

        <OAuthButtons
          onGoogle={() => void signInWithOAuth("google")}
          onGithub={() => void signInWithOAuth("github")}
        />

        <AuthDivider />

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className={authLabelClass}>
                Password
              </Label>
              <Link href="/forgot-password" className="text-xs text-gray-500 hover:text-gray-900">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              className={authInputClass}
              {...register("password")}
            />
            {errors.password && (
              <p className={authErrorClass}>{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className={authSubmitClass} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className={authFooterClass}>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className={authFooterLinkClass}>
            Sign up
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
