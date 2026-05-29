import { test, expect } from "@playwright/test";

test("home page loads and renders", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);

  await page.screenshot({
    path: "e2e/test-results/home.png",
    fullPage: true,
  });
});
