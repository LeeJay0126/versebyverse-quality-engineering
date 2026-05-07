const { expect, test } = require("@playwright/test");
const { getApiBaseUrl, getTestCredentials } = require("../config/env");
const { createAuthenticatedRequestContext } = require("../support/authSession");

test.describe("API preflight", () => {
  test("API_BASE_URL is reachable and returns health status", async ({ request }) => {
    let response;

    try {
      response = await request.get(`${getApiBaseUrl()}/health`);
    } catch (error) {
      throw new Error(`API_BASE_URL is unreachable at ${getApiBaseUrl()}. Start the backend or update automation/.env.`);
    }

    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "up",
    });
  });

  test("configured authenticated test user can log in", async () => {
    const { username, password } = getTestCredentials();
    test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to verify login preflight.");

    const api = await createAuthenticatedRequestContext();
    await api.dispose();
  });
});
