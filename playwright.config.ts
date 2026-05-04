import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["TRELLO_API_KEY", "TRELLO_TOKEN"];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar])
    throw new Error(`Missing required environment variable: ${envVar}`);
}

export const ENV = {
  api_key: process.env.TRELLO_API_KEY!,
  token: process.env.TRELLO_TOKEN!,
};

export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: "https://api.trello.com",
    extraHTTPHeaders: {
      Accept: "application/json",
    },

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "api",
      use: {},
    },
  ],
});
