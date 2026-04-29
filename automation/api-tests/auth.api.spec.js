const { expect, test } = require("@playwright/test");
const { getApiBaseUrl } = require("../config/env");

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
});
