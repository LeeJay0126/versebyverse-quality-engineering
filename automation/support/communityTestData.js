const { expect, test } = require("@playwright/test");
const { getTestCredentials } = require("../config/env");

function skipWithoutCredentials() {
  const { username, password } = getTestCredentials();
  test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to run this test.");
}

function getCommunityId(community) {
  return community?.id || community?._id || "";
}

function getPostId(post) {
  return post?.id || post?._id || post?.postId || "";
}

async function createTestCommunity(api, overrides = {}) {
  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const payload = {
    header: `Automation Community ${unique}`,
    subheader: `Created by Playwright automation ${unique}`,
    content: `Temporary community for API smoke tests ${unique}`,
    type: "Bible Study",
    ...overrides,
  };

  const response = await api.post("/community", { data: payload });
  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body.ok).toBe(true);
  expect(body.community).toBeTruthy();

  const communityId = getCommunityId(body.community);
  expect(communityId).toBeTruthy();

  return {
    body,
    community: body.community,
    communityId,
    payload,
  };
}

async function disbandIfPresent(api, communityId) {
  if (communityId) {
    await api.delete(`/community/${communityId}/disband`).catch(() => {});
  }
}

module.exports = {
  createTestCommunity,
  disbandIfPresent,
  getCommunityId,
  getPostId,
  skipWithoutCredentials,
};
