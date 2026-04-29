const { expect } = require("@playwright/test");
const { getApiBaseUrl } = require("../config/env");

function apiUrl(path) {
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

async function expectOkJson(response) {
  expect(response.ok()).toBeTruthy();
  return response.json();
}

module.exports = {
  apiUrl,
  expectOkJson,
};
