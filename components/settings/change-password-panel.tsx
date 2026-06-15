"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import {
  formatAuthError,
  formatSupabaseAuthError,
} from "@/lib/supabase/config";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/validations/auth";

export function ChangePasswordPanel() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        throw new Error("Not authenticated");
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: data.currentPassword,
      });

      if (signInError) {
        toast({
          title: "Current password is incorrect",
          description: formatSupabaseAuthError(signInError.message, "login"),
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        toast({
          title: "Could not update password",
          description: formatSupabaseAuthError(error.message, "login"),
          variant: "destructive",
        });
        return;
      }

      reset();
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
    } catch (err) {
      toast({
        title: "Could not update password",
        description: formatAuthError(err),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          <KeyRound className="size-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Change password</h2>
          <p className="text-sm text-muted-foreground">
            Update your account password.
          </p>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Current password</Label>
          <PasswordInput id="currentPassword" {...register("currentPassword")} />
          {errors.currentPassword && (
            <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New password</Label>
          <PasswordInput id="newPassword" {...register("newPassword")} />
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <PasswordInput id="confirmPassword" {...register("confirmPassword")} />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="btn-brand" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>
    </div>
  );
}
