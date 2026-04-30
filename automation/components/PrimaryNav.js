const { expect } = require("@playwright/test");

class PrimaryNav {
  constructor(page) {
    this.page = page;
    this.nav = page.getByRole("navigation", { name: "Primary" }).first();
    this.homeLink = this.nav.getByRole("link", { name: /^home$/i });
    this.aboutLink = this.nav.getByRole("link", { name: /^about$/i });
    this.studyLink = this.nav.getByRole("link", { name: /study/i });
    this.communitiesLink = this.nav.getByRole("link", { name: /communities/i });
    this.loginLink = this.nav.getByRole("link", { name: /^login$/i });

    this.userMenuButton = page.locator(".UserMenuButton").first();
    this.notificationsButton = page.getByRole("button", { name: /notifications/i });
    this.profileButton = page.getByRole("button", { name: /^profile$/i });
    this.myNotesButton = page.getByRole("button", { name: /my notes/i });
    this.logoutButton = page.getByRole("button", { name: /log out/i });
  }

  async expectPublicLinksVisible() {
    await expect(this.homeLink).toBeVisible();
    await expect(this.aboutLink).toBeVisible();
    await expect(this.studyLink).toBeVisible();
    await expect(this.communitiesLink).toBeVisible();
  }

  async expectLoggedOutState() {
    await this.expectPublicLinksVisible();
    await expect(this.loginLink).toBeVisible();
    await expect(this.userMenuButton).toBeHidden();
  }

  async expectLoggedInState() {
    await this.expectPublicLinksVisible();
    await expect(this.loginLink).toBeHidden();
    await expect(this.userMenuButton).toBeVisible();
  }

  async goToHome() {
    await this.homeLink.click();
  }

  async goToAbout() {
    await this.aboutLink.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async goToStudy() {
    await this.studyLink.click();
  }

  async goToCommunities() {
    await this.communitiesLink.click();
  }

  async goToNotifications() {
    await this.openUserMenu();
    await this.notificationsButton.click();
  }

  async goToProfile() {
    await this.openUserMenu();
    await this.profileButton.click();
  }

  async goToMyNotes() {
    await this.openUserMenu();
    await this.myNotesButton.click();
  }

  async openUserMenu() {
    await this.userMenuButton.click();
  }

  async logout() {
    await this.openUserMenu();
    await this.logoutButton.click();
  }
}

module.exports = { PrimaryNav };
