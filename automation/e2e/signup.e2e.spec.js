const { expect, test } = require("@playwright/test");
const { SignupPage } = require("../pages/authentication/SignupPage");


test.describe("Signup Test", () => {
    test("Signup page loads", async ({ page }) => {
        const signupPage = new SignupPage(page);

        await signupPage.goto();
        await signupPage.expectLoaded();
    });

    test("Invalid email address error verification", async ({ page }) => {
        const signupPage = new SignupPage(page);

        await signupPage.goto();
        await signupPage.expectLoaded();

        await signupPage.fillRequiredFields({
            firstName: "John",
            lastName: "Doe",
            /* Invalid email input */
            email: "emailinvalid",
            username: `invaliduser${Date.now()}`,
            password: "InvalidPassword123!"
        });

        await signupPage.submit();
        await signupPage.expectValidationError();
    })
})
