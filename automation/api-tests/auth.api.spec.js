const { expect, test } = require("@playwright/test");
const { getApiBaseUrl, getTestCredentials } = require("../config/env");
const { createAuthenticatedRequestContext } = require("../support/authSession");

test.describe("Auth API", () => {
  test("GET /auth/me rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/auth/me`);
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      ok: false,
      error: "Not authenticated",
    });
  });

  test("POST /auth/login rejects invalid credentials", async ({ request }) => {
    const response = await request.post(`${getApiBaseUrl()}/auth/login`, {
      data: {
        identifier: "not-a-real-user@example.com",
        password: "WrongPassword123!",
      },
    });

    expect([400, 401]).toContain(response.status());
  });

  test("GET /auth/me returns current user after login", async () => {
    const { username, password } = getTestCredentials();
    test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to run this test.");

    const api = await createAuthenticatedRequestContext();

    try {
      const response = await api.get("/auth/me");
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.user).toBeTruthy();
    } finally {
      await api.dispose();
    }
  });

  test("POST /auth/logout clears the authenticated session", async () => {
    const { username, password } = getTestCredentials();
    test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to run this test.");

    const api = await createAuthenticatedRequestContext();

    try {
      const logoutResponse = await api.post("/auth/logout");
      const logoutBody = await logoutResponse.json();

      expect(logoutResponse.status()).toBe(200);
      expect(logoutBody.ok).toBe(true);

      const meResponse = await api.get("/auth/me");
      const meBody = await meResponse.json();

      expect(meResponse.status()).toBe(401);
      expect(meBody).toMatchObject({
        ok: false,
        error: "Not authenticated",
      });
    } finally {
      await api.dispose();
    }
  });
});
