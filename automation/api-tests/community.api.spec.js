const { expect, test } = require("@playwright/test");
const { getApiBaseUrl } = require("../config/env");
const { createAuthenticatedRequestContext } = require("../support/authSession");
const {
  createTestCommunity,
  disbandIfPresent,
  skipWithoutCredentials,
} = require("../support/communityTestData");

test.describe("Community API", () => {
  test("GET /community/discover returns a public community list", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/community/discover`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.communities)).toBe(true);
  });

  test("GET /community/my rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/community/my`);
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      ok: false,
      error: "Not authenticated",
    });
  });

  test("POST /community rejects unauthenticated requests", async ({ request }) => {
    const response = await request.post(`${getApiBaseUrl()}/community`, {
      data: {
        header: "Unauthorized Automation Community",
        subheader: "This request should be rejected",
        content: "Community creation requires authentication.",
        type: "Bible Study",
      },
    });
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      ok: false,
      error: "Not authenticated",
    });
  });

  test("authenticated user can create, fetch, list, and disband a community", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let communityId = "";

    try {
      const created = await createTestCommunity(api);
      communityId = created.communityId;

      expect(created.community.header).toBe(created.payload.header);
      expect(created.community.role).toBe("Owner");
      expect(created.community.my).toBe(true);

      const detailResponse = await api.get(`/community/${communityId}`);
      const detailBody = await detailResponse.json();

      expect(detailResponse.status()).toBe(200);
      expect(detailBody.ok).toBe(true);
      expect(String(detailBody.community.id || detailBody.community._id)).toBe(String(communityId));
      expect(detailBody.community.header).toBe(created.payload.header);

      const myResponse = await api.get("/community/my");
      const myBody = await myResponse.json();

      expect(myResponse.status()).toBe(200);
      expect(myBody.ok).toBe(true);
      expect(Array.isArray(myBody.communities)).toBe(true);
      expect(
        myBody.communities.some((community) => String(community.id || community._id) === String(communityId))
      ).toBe(true);

      const disbandResponse = await api.delete(`/community/${communityId}/disband`);
      const disbandBody = await disbandResponse.json();

      expect(disbandResponse.status()).toBe(200);
      expect(disbandBody.ok).toBe(true);
      expect(disbandBody.deleted.community).toBe(1);

      communityId = "";
    } finally {
      await disbandIfPresent(api, communityId);
      await api.dispose();
    }
  });
});
