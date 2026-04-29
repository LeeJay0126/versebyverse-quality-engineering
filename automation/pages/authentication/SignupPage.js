const { expect } = require("@playwright/test");

class SignupPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /create account|sign up/i });
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.getByLabel(/^email$/i);
    this.usernameInput = page.getByLabel(/^username$/i);
    this.passwordInput = page.getByLabel(/^password$/i);
    this.confirmPasswordInput = page.getByLabel(/confirm password/i);
    this.submitButton = page.getByRole("button", { name: /create account/i });
    this.alert = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
  }

  async fillRequiredFields({ firstName, lastName, email, username, password }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectValidationError() {
    await expect(this.alert).toBeVisible();
  }
}

module.exports = { SignupPage };
