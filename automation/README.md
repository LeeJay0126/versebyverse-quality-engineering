# VerseByVerse Playwright Automation

This folder contains executable Playwright automation for the VerseByVerse QA portfolio. It includes API tests, browser E2E smoke tests, reusable authentication/session helpers, test data cleanup, and HTML/JSON/JUnit reporting.

## Current Coverage

- API preflight checks for backend health and configured test-user login
- Authentication/session API checks, including unauthenticated access and invalid login handling
- Notes API checks for create, read, update, delete, search, filtering, and negative paths
- Community API checks for discovery, authentication guards, create/list/detail workflows, and cleanup
- Community post API checks for create/list/detail workflows and required-field validation
- Browser E2E smoke checks for login, signup, protected routes, authenticated navigation, and core page loading

## 1. Install Dependencies

From this folder:

```powershell
cd C:\GitHub\versebyverse-quality-engineering\automation
npm install
npx playwright install chromium
```

`npm install` installs the Playwright test runner and dotenv. `npx playwright install chromium` is only needed for browser E2E tests.

## 2. Configure Environment

Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

Update `.env` for your target environment:

```text
WEB_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:4000
E2E_TEST_USERNAME=your-verified-test-user
E2E_TEST_PASSWORD=your-test-password
```

The authenticated API tests are skipped when `E2E_TEST_USERNAME` or `E2E_TEST_PASSWORD` is missing. Public API checks and unauthenticated negative tests still run without credentials.

## 3. Start The App Under Test

Before running tests against local defaults, start the VerseByVerse frontend and backend in their own terminals.

Expected local defaults:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000
```

For deployed targets, set `WEB_BASE_URL` and `API_BASE_URL` to the deployed frontend and backend URLs.

## 4. Recommended Run Order

Run the preflight first. This confirms the backend is reachable and verifies the configured test user when credentials are present.

```powershell
npm run test:preflight
```

Run only notes API coverage:

```powershell
npm run test:notes
```

Run only community API coverage:

```powershell
npm run test:community
```

Run the full API suite:

```powershell
npm run test:api
```

Run browser E2E tests after the frontend is available:

```powershell
npm run test:e2e
```

Run everything:

```powershell
npm test
```

Open the latest HTML report:

```powershell
npm run report
```

## Reports

Playwright writes report artifacts to ignored local folders:

```text
playwright-report/          HTML report
test-results/results.json   JSON report
test-results/results.xml    JUnit report
test-results/               traces, screenshots, and videos on failure
```

These reports are intentionally ignored by git so the repository stays clean while local and CI runs can still generate evidence.

## Structure

```text
automation/
  api-tests/       API-level Playwright tests
  components/      reusable UI components such as navigation
  config/          environment helpers
  e2e/             browser-based end-to-end tests
  pages/           page objects
  support/         reusable API/test helpers
```

## Test Data Cleanup

Authenticated API tests create temporary notes, communities, and posts with unique timestamps. Tests store created record ids and attempt cleanup in `finally` blocks so failed assertions do not leave avoidable test data behind.

## Page Object Pattern

Browser tests keep selectors in page/component objects where practical. Tests should describe behavior; page objects and component objects should own selectors and repeated UI actions.

Example:

```js
const loginPage = new LoginPage(page);

await loginPage.goto();
await loginPage.login("testusername", "Password123!");
await loginPage.expectLoginError();
```
