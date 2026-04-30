const { expect } = require("@playwright/test");
const { PrimaryNav } = require("../../components/PrimaryNav");

class HomePage {
  constructor(page) {
    this.page = page;
    this.primaryNav = new PrimaryNav(page);

    this.logoLink = page.getByRole("link", { name: /^verse by verse$/i });
    this.heroHeading = page.getByRole("heading", { name: /explore the bible/i });
    this.heroSubheading = page.getByRole("heading", { name: /one verse at a time/i });
    this.getStartedLink = page.getByRole("link", { name: /^get started$/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectLoaded() {
    await expect(this.logoLink).toBeVisible();
    await expect(this.heroHeading).toBeVisible();
    await expect(this.heroSubheading).toBeVisible();
    await expect(this.getStartedLink).toBeVisible();
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

}

module.exports = { HomePage };
