const { expect, test } = require("@playwright/test");
const { getTestCredentials } = require("../config/env");
const { LoginPage } = require("../pages/authentication/LoginPage");

test.describe("Authenticated smoke", () => {
  test("verified user can sign in and reach a protected page", async ({ page }) => {
    const { username, password } = getTestCredentials();

    test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to run this test.");

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(username, password);

    await expect(page).toHaveURL(/\/$/);

    await page.goto("/notifications");
    await expect(page).toHaveURL(/\/notifications/);
  });
});
