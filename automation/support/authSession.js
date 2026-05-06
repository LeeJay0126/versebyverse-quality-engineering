const { expect, request } = require("@playwright/test");
const { getApiBaseUrl, getTestCredentials } = require("../config/env");

async function createAuthenticatedRequestContext() {
  const { username, password } = getTestCredentials();

  if (!username || !password) {
    throw new Error("Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in automation/.env");
  }

  const apiContext = await request.newContext({
    baseURL: getApiBaseUrl(),
  });

  const loginResponse = await apiContext.post("/auth/login", {
    data: {
      identifier: username,
      password,
    },
  });

  let body = {};
  try {
    body = await loginResponse.json();
    expect(loginResponse.status()).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.user).toBeTruthy();
  } catch (error) {
    await apiContext.dispose();
    throw error;
  }

  return apiContext;
}

module.exports = {
  createAuthenticatedRequestContext,
};
