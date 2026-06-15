import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("shows hero and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /chat that flows with your team/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /sign in/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i }).first()).toBeVisible();
  });
});

test.describe("Auth pages", () => {
  test("login page renders form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
  });

  test("signup page renders form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create an account/i })).toBeVisible();
    await expect(page.getByLabel("Confirm password")).toBeVisible();
  });
});

test.describe("Protected routes", () => {
  test("redirects unauthenticated users from channels to login", async ({ page }) => {
    await page.goto("/channels");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects unauthenticated users from search to login", async ({ page }) => {
    await page.goto("/search");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects unauthenticated users from settings to login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Stripe checkout", () => {
  test("settings page requires authentication", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/);
  });
});
