import type { Profile, SubscriptionTier } from "@/lib/types/database";
import { isProTier } from "@/lib/types/database";
import { create } from "zustand";

interface UserState {
  profile: Profile | null;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  isPro: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  isLoading: true,
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  isPro: () => isProTier(get().profile?.subscription_tier ?? "free"),
}));

export function getSubscriptionLabel(tier: SubscriptionTier): string {
  if (isProTier(tier)) return "Pro";
  return "Free";
}
