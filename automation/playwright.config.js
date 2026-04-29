const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

const WEB_BASE_URL = process.env.WEB_BASE_URL || "http://localhost:3000";

module.exports = defineConfig({
  testDir: ".",
  outputDir: "test-results",
  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: WEB_BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "api",
      testMatch: "api-tests/**/*.spec.js",
    },
    {
      name: "chromium",
      testMatch: "e2e/**/*.spec.js",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
