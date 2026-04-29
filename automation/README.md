# VerseByVerse Playwright Automation

This folder contains the starter Playwright automation framework for VerseByVerse QA coverage.

The first version is intentionally small:

- API checks for health, auth/session behavior, and negative validation
- E2E checks for login page loading and protected-route redirects
- A basic page object for the login screen
- Environment-based configuration for local or deployed test targets

## 1. Install Dependencies

From this folder:

```powershell
cd C:\GitHub\versebyverse-quality-engineering\automation
npm install
npx playwright install chromium
```

## 2. Configure Local Environment

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Update `.env` if your app runs on different ports:

```text
WEB_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
```

For authenticated tests, add a verified test account:

```text
E2E_TEST_EMAIL=your-test-user@example.com
E2E_TEST_PASSWORD=your-test-password
```

## 3. Start The App Under Test

Before running E2E tests, start the VerseByVerse frontend and backend in their own terminals.

Expected local defaults:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000
```

## 4. Run Tests

Run everything:

```powershell
npm test
```

Run only API tests:

```powershell
npm run test:api
```

Run only browser E2E tests:

```powershell
npm run test:e2e
```

Run browser tests in headed mode:

```powershell
npm run test:headed
```

Open the latest HTML report:

```powershell
npm run report
```

## Current Structure

```text
automation/
  api-tests/       API-level Playwright tests
  components/      reusable UI components such as navigation
  e2e/             browser-based end-to-end tests
  config/          environment helpers
  pages/           page objects
  support/         reusable API/test helpers
```

## Page Object Pattern

Tests should describe behavior. Page objects and component objects should own selectors.

Example:

```js
const loginPage = new LoginPage(page);

await loginPage.goto();
await loginPage.login("user@example.com", "Password123!");
await loginPage.expectLoginError();
```

Use `pages/` for full screens, such as `LoginPage` and `SignupPage`.
Use `components/` for shared UI pieces, such as `PrimaryNav`.

## MVP Coverage

The starter suite maps to high-value QA cases:

- API health check
- unauthenticated `/auth/me` rejection
- invalid login rejection
- login page smoke check
- protected route redirect checks
- optional verified-user login smoke test

## Next Automation Targets

After this setup is running, the next best additions are:

- notes API create/list/update/delete tests
- successful login setup through API or UI
- community creation and membership checks
- notification invite/read/action workflows
- smoke regression suite for portfolio demos
