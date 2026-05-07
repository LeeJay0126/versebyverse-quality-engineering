const { expect, test } = require("@playwright/test");
const { getApiBaseUrl } = require("../config/env");
const { createAuthenticatedRequestContext } = require("../support/authSession");
const {
  createTestCommunity,
  disbandIfPresent,
  getPostId,
  skipWithoutCredentials,
} = require("../support/communityTestData");

test.describe("Community Posts API", () => {
  test("GET /community/:id/posts rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/community/000000000000000000000000/posts`);
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      ok: false,
      error: "Not authenticated",
    });
  });

  test("community owner can create, list, and fetch a question post", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let communityId = "";

    try {
      const community = await createTestCommunity(api);
      communityId = community.communityId;

      const unique = Date.now();
      const postPayload = {
        title: `Automation Question ${unique}`,
        body: `What stood out from this passage? ${unique}`,
        type: "questions",
      };

      const createPostResponse = await api.post(`/community/${communityId}/posts`, {
        data: postPayload,
      });
      const createPostBody = await createPostResponse.json();

      expect(createPostResponse.status()).toBe(201);
      expect(createPostBody.ok).toBe(true);
      expect(createPostBody.postId).toBeTruthy();

      const postId = createPostBody.postId;

      const listResponse = await api.get(`/community/${communityId}/posts`);
      const listBody = await listResponse.json();

      expect(listResponse.status()).toBe(200);
      expect(listBody.ok).toBe(true);
      expect(Array.isArray(listBody.posts)).toBe(true);
      expect(listBody.posts.some((post) => String(getPostId(post)) === String(postId))).toBe(true);

      const detailResponse = await api.get(`/community/${communityId}/posts/${postId}`);
      const detailBody = await detailResponse.json();

      expect(detailResponse.status()).toBe(200);
      expect(detailBody.ok).toBe(true);
      expect(String(getPostId(detailBody.post))).toBe(String(postId));
      expect(detailBody.post.title).toBe(postPayload.title);
      expect(detailBody.post.body).toBe(postPayload.body);
      expect(detailBody.post.type).toBe("questions");
    } finally {
      await disbandIfPresent(api, communityId);
      await api.dispose();
    }
  });

  test("POST /community/:id/posts rejects missing title", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let communityId = "";

    try {
      const community = await createTestCommunity(api);
      communityId = community.communityId;

      const response = await api.post(`/community/${communityId}/posts`, {
        data: {
          body: "This request intentionally omits title.",
          type: "questions",
        },
      });
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(body).toMatchObject({
        ok: false,
        error: "Title is required.",
      });
    } finally {
      await disbandIfPresent(api, communityId);
      await api.dispose();
    }
  });
});
