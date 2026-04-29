function trimTrailingSlash(value) {
  return String(value || "").replace(/\/$/, "");
}

function getWebBaseUrl() {
  return trimTrailingSlash(process.env.WEB_BASE_URL || "http://localhost:3000");
}

function getApiBaseUrl() {
  return trimTrailingSlash(process.env.API_BASE_URL || "http://localhost:4000");
}

function getTestCredentials() {
  return {
    email: process.env.E2E_TEST_EMAIL || "",
    password: process.env.E2E_TEST_PASSWORD || "",
  };
}

module.exports = {
  getApiBaseUrl,
  getTestCredentials,
  getWebBaseUrl,
};
