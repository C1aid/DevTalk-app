import { describe, expect, it } from "vitest";
import {
  canCreateChannel,
  FREE_CHANNEL_LIMIT,
  FREE_HISTORY_DAYS,
  getHistoryCutoff,
  isProTier,
} from "@/lib/types/database";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

describe("subscription checks", () => {
  it("allows free users to create channels under the limit", () => {
    expect(canCreateChannel("free", 0)).toBe(true);
    expect(canCreateChannel("free", FREE_CHANNEL_LIMIT - 1)).toBe(true);
  });

  it("blocks free users at the channel limit", () => {
    expect(canCreateChannel("free", FREE_CHANNEL_LIMIT)).toBe(false);
  });

  it("allows pro users unlimited channels", () => {
    expect(canCreateChannel("pro", 100)).toBe(true);
    expect(canCreateChannel("premium", 100)).toBe(true);
  });

  it("limits free user message history to 90 days", () => {
    expect(isProTier("free")).toBe(false);
    const cutoff = getHistoryCutoff("free");
    expect(cutoff).not.toBeNull();
    const daysDiff = Math.round(
      (Date.now() - (cutoff as Date).getTime()) / (1000 * 60 * 60 * 24),
    );
    expect(daysDiff).toBe(FREE_HISTORY_DAYS);
  });

  it("gives pro users unlimited history", () => {
    expect(getHistoryCutoff("pro")).toBeNull();
  });
});

describe("auth validation", () => {
  it("validates login input", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "secret123",
    });
    expect(result.success).toBe(true);
  });

  it("validates signup with matching passwords", () => {
    const result = signupSchema.safeParse({
      name: "John Doe",
      email: "user@example.com",
      password: "secret123",
      confirmPassword: "secret123",
    });
    expect(result.success).toBe(true);
  });
});
