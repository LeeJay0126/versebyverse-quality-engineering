const { expect, test } = require("@playwright/test");
const { getTestCredentials } = require("../config/env");
const { LoginPage } = require("../pages/authentication/LoginPage");

test.describe("Authenticated smoke", () => {
  test("verified user can sign in and reach a protected page", async ({ page }) => {
    const { email, password } = getTestCredentials();

    test.skip(!email || !password, "Set E2E_TEST_EMAIL and E2E_TEST_PASSWORD in .env to run this test.");

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);

    await expect(page).toHaveURL(/\/$/);

    await page.goto("/notifications");
    await expect(page).toHaveURL(/\/notifications/);
  });
});
