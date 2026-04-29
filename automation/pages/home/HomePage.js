const { expect } = require("@playwright/test");

class HomePage {
  constructor(page) {
    this.page = page;
    this.logoLink = page.getByRole("link", { name: /^verse by verse$/i });
    this.nav = page.getByRole("navigation", { name: "Primary" }).first();
    this.homeLink = this.nav.getByRole("link", { name: /^home$/i });
    this.aboutLink = this.nav.getByRole("link", { name: /^about$/i });
    this.studyLink = this.nav.getByRole("link", { name: /study/i });
    this.communitiesLink = this.nav.getByRole("link", { name: /communities/i });
    this.loginLink = this.nav.getByRole("link", { name: /^login$/i });
    this.heroHeading = page.getByRole("heading", { name: /explore the bible/i });
    this.getStartedLink = page.getByRole("link", { name: /^get started$/i });
  }

  async goto() {
    await this.page.goto("/");
  }

  async expectLoaded() {
    await expect(this.logoLink).toBeVisible();
    await expect(this.heroHeading).toBeVisible();
    await expect(this.getStartedLink).toBeVisible();
  }
}

module.exports = { HomePage };
