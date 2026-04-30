const { expect, test } = require("@playwright/test");
const { HomePage } = require("../pages/home/HomePage");
const { LoginPage } = require("../pages/authentication/LoginPage");

/*
NAV-E2E-001: Logged-out nav shows Home, About, Study & Reflect, Communities, Login
NAV-E2E-002: Login link opens the sign-in page
NAV-E2E-003: Get Started opens the About page

*/
test.describe("Navigation Smoke Test", () => {
  test("logged-out navigation shows public links and login", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.expectLoaded();

    await homePage.primaryNav.expectLoggedOutState();
  });

  test("login link opens the sign-in page", async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.goto();
    await homePage.primaryNav.goToLogin();

    await loginPage.expectAtLoginPage();
  });

  test("get started opens the about page", async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.clickGetStarted();

    await expect(page).toHaveURL(/\/about/);
  });
});
