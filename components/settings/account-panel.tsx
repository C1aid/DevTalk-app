"use client";

import { Camera, Loader2, LogOut, Mail, Shield, Trash2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getDisplayName } from "@/lib/profile/display";
import { isProTier, type Profile } from "@/lib/types/database";
import { formatDate } from "@/lib/utils";
import { getSubscriptionLabel } from "@/store/user-store";
import { cn } from "@/lib/utils";

type AccountPanelProps = {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
  onSignOut: () => void;
};

export function AccountPanel({
  profile,
  onProfileUpdate,
  onSignOut,
}: AccountPanelProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const isPro = isProTier(profile.subscription_tier);

  useEffect(() => {
    setDisplayName(profile.display_name ?? "");
  }, [profile.display_name]);

  const handleSaveName = async () => {
    const trimmed = displayName.trim();
    if (!trimmed) {
      toast({
        title: "Name required",
        description: "Enter your display name.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingName(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ display_name: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Could not save name");
      }

      const updated = (await res.json()) as Profile;
      onProfileUpdate(updated);
      toast({ title: "Profile updated", description: "Your display name was saved." });
    } catch (err) {
      toast({
        title: "Save failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSavingName(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Could not upload photo");
      }

      const updated = (await res.json()) as Profile;
      onProfileUpdate(updated);
      toast({ title: "Photo updated", description: "Your avatar was uploaded." });
    } catch (err) {
      toast({
        title: "Upload failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      const res = await fetch("/api/profile/avatar", { method: "DELETE" });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Could not remove photo");
      }

      const updated = (await res.json()) as Profile;
      onProfileUpdate(updated);
      toast({ title: "Photo removed" });
    } catch (err) {
      toast({
        title: "Remove failed",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-white/20 via-white/60 to-white/20" />

      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <UserAvatar
              profile={profile}
              className="size-16 ring-2 ring-border"
              fallbackClassName="text-lg font-bold bg-white text-black"
            />
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black text-white transition-smooth hover:bg-white/10"
              aria-label="Upload avatar"
            >
              {isUploadingAvatar ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleAvatarChange(file);
                e.target.value = "";
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Account
            </p>
            <h2 className="mt-1 truncate text-lg font-semibold text-foreground">
              {getDisplayName(profile)}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
                  isPro
                    ? "bg-white/10 text-white ring-white/20"
                    : "bg-white/5 text-gray-300 ring-white/10",
                )}
              >
                {getSubscriptionLabel(profile.subscription_tier)}
              </span>
              <span className="text-xs text-muted-foreground">
                Member since {formatDate(profile.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <div className="space-y-2">
            <Label htmlFor="display-name">Display name</Label>
            <div className="flex gap-2">
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your real name"
                maxLength={100}
              />
              <Button
                type="button"
                onClick={() => void handleSaveName()}
                disabled={isSavingName}
                className="shrink-0"
              >
                {isSavingName ? <Loader2 className="size-4 animate-spin" /> : "Save"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Shown in channels and messages instead of your email.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="mr-2 size-4" />
              Upload photo
            </Button>
            {profile.avatar_url && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isRemovingAvatar}
                onClick={() => void handleRemoveAvatar()}
              >
                {isRemovingAvatar ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 size-4" />
                )}
                Remove photo
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            PNG, JPEG, WebP, or GIF — max 2 MB.
          </p>
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Mail className="size-4 shrink-0 text-primary" />
            <span className="truncate">{profile.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Shield className="size-4 shrink-0 text-primary" />
            <span>Secured with Supabase Auth</span>
          </div>
        </div>

        <Button variant="outline" className="mt-6 w-full" onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}
