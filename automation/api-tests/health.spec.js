const { expect, test } = require("@playwright/test");
const { getApiBaseUrl } = require("../config/env");

test.describe("API health", () => {
  test("GET /health returns server status", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/health`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body).toMatchObject({
      ok: true,
      status: "up",
    });
  });
});
