const { expect, test } = require("@playwright/test");
const { PrimaryNav } = require("../components/PrimaryNav");
const { LoginPage } = require("../pages/authentication/LoginPage");

test.describe("Authentication UI", () => {
  test("login page loads", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();
  });

  test("protected notifications page redirects logged-out users to sign in", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto("/notifications");

    await loginPage.expectAtLoginPage();
  });

  test("protected study page redirects logged-out users to Bible walkthrough", async ({ page }) => {
    await page.goto("/study");

    await expect(page).toHaveURL(/\/bible\/walkthrough/);
  });

  test("invalid login shows an error", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("testuser", "PostmanPassword123!");

    await loginPage.expectLoginError();
  });

  test("primary navigation shows logged-out auth link", async ({ page }) => {
    const nav = new PrimaryNav(page);

    await page.goto("/");

    await nav.expectLoggedOutState();
  });
});
