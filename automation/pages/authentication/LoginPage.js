const { expect } = require("@playwright/test");

class LoginPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /sign in/i });
    this.identifierInput = page.getByLabel(/username \/ email/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.submitButton = page.getByRole("button", { name: /sign in/i });
    this.alert = page.getByRole("alert");
    this.signupLink = page.getByRole("link", { name: /sign up/i });
  }

  async goto() {
    await this.page.goto("/account");
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.identifierInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async login(identifier, password) {
    await this.identifierInput.fill(identifier);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async expectLoginError() {
    await expect(this.alert).toBeVisible();
  }

  async expectAtLoginPage() {
    await expect(this.page).toHaveURL(/\/account/);
    await this.expectLoaded();
  }
}

module.exports = { LoginPage };
