const { expect, test } = require("@playwright/test");
const { getApiBaseUrl, getTestCredentials } = require("../config/env");
const { createAuthenticatedRequestContext } = require("../support/authSession");

const TEST_BIBLE_ID = "de4e12af7f28f599-02";
const TEST_CHAPTER_ID = "GEN.1";
const NONEXISTENT_NOTE_ID = "000000000000000000000000";

function skipWithoutCredentials() {
  const { username, password } = getTestCredentials();
  test.skip(!username || !password, "Set E2E_TEST_USERNAME and E2E_TEST_PASSWORD in .env to run this test.");
}

function getNoteId(note) {
  return note?._id || note?.id || "";
}

async function createTestNote(api, overrides = {}) {
  const unique = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const payload = {
    bibleId: TEST_BIBLE_ID,
    chapterId: TEST_CHAPTER_ID,
    rangeStart: 1,
    rangeEnd: 3,
    title: `Automation Note ${unique}`,
    text: `Created by Playwright automation ${unique}`,
    ...overrides,
  };

  const response = await api.post("/notes", { data: payload });
  const body = await response.json();

  expect(response.status()).toBe(201);
  expect(body.ok).toBe(true);
  expect(body.note).toBeTruthy();

  const noteId = getNoteId(body.note);
  expect(noteId).toBeTruthy();

  return {
    body,
    note: body.note,
    noteId,
    payload,
  };
}

async function deleteIfPresent(api, noteId) {
  if (noteId) {
    await api.delete(`/notes/${noteId}`).catch(() => {});
  }
}

test.describe("Notes API", () => {
  test("GET /notes/list rejects unauthenticated requests", async ({ request }) => {
    const response = await request.get(`${getApiBaseUrl()}/notes/list`);
    const body = await response.json();

    expect(response.status()).toBe(401);
    expect(body).toMatchObject({
      ok: false,
      error: "Not authenticated",
    });
  });

  test("POST /notes rejects missing required scope fields", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();

    try {
      const response = await api.post("/notes", {
        data: {
          title: "Invalid automation note",
          text: "This request intentionally omits bibleId and chapterId.",
        },
      });
      const body = await response.json();

      expect(response.status()).toBe(400);
      expect(body).toMatchObject({
        ok: false,
        error: "Missing bibleId or chapterId",
      });
    } finally {
      await api.dispose();
    }
  });

  test("PUT /notes/:id returns 404 for a nonexistent note", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();

    try {
      const response = await api.put(`/notes/${NONEXISTENT_NOTE_ID}`, {
        data: {
          title: "Updated missing note",
          text: "This note id should not exist.",
        },
      });
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(body).toMatchObject({
        ok: false,
        error: "Note not found",
      });
    } finally {
      await api.dispose();
    }
  });

  test("DELETE /notes/:id returns 404 for a nonexistent note", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();

    try {
      const response = await api.delete(`/notes/${NONEXISTENT_NOTE_ID}`);
      const body = await response.json();

      expect(response.status()).toBe(404);
      expect(body).toMatchObject({
        ok: false,
        error: "Note not found",
      });
    } finally {
      await api.dispose();
    }
  });

  test("GET /notes/exists returns true after creating a note for a chapter", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let noteId = "";

    try {
      const created = await createTestNote(api);
      noteId = created.noteId;

      const response = await api.get(`/notes/exists?bibleId=${TEST_BIBLE_ID}&chapterId=${TEST_CHAPTER_ID}`);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body).toMatchObject({
        ok: true,
        hasAnyNote: true,
      });
    } finally {
      await deleteIfPresent(api, noteId);
      await api.dispose();
    }
  });

  test("GET /notes returns the scoped note for bibleId, chapterId, and verse range", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let noteId = "";

    try {
      const created = await createTestNote(api, {
        rangeStart: 4,
        rangeEnd: 6,
      });
      noteId = created.noteId;

      const response = await api.get(
        `/notes?bibleId=${TEST_BIBLE_ID}&chapterId=${TEST_CHAPTER_ID}&rangeStart=4&rangeEnd=6`
      );
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.ok).toBe(true);
      expect(body.note).toBeTruthy();
      expect(String(getNoteId(body.note))).toBe(String(noteId));
      expect(body.note.rangeStart).toBe(4);
      expect(body.note.rangeEnd).toBe(6);
    } finally {
      await deleteIfPresent(api, noteId);
      await api.dispose();
    }
  });

  test("GET /notes/list can search notes by unique title text", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let noteId = "";

    try {
      const unique = `search-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const created = await createTestNote(api, {
        title: `Automation Search ${unique}`,
        text: `Searchable body ${unique}`,
      });
      noteId = created.noteId;

      const response = await api.get(`/notes/list?q=${encodeURIComponent(unique)}`);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.ok).toBe(true);
      expect(Array.isArray(body.notes)).toBe(true);
      expect(body.notes.some((note) => String(getNoteId(note)) === String(noteId))).toBe(true);
    } finally {
      await deleteIfPresent(api, noteId);
      await api.dispose();
    }
  });

  test("GET /notes/list can filter notes by chapterId", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let noteId = "";

    try {
      const created = await createTestNote(api);
      noteId = created.noteId;

      const response = await api.get(`/notes/list?chapterId=${TEST_CHAPTER_ID}`);
      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.ok).toBe(true);
      expect(Array.isArray(body.notes)).toBe(true);
      expect(body.notes.some((note) => String(getNoteId(note)) === String(noteId))).toBe(true);
      expect(body.notes.every((note) => note.chapterId === TEST_CHAPTER_ID)).toBe(true);
    } finally {
      await deleteIfPresent(api, noteId);
      await api.dispose();
    }
  });

  test("authenticated user can create, read, update, and delete a note", async () => {
    skipWithoutCredentials();

    const api = await createAuthenticatedRequestContext();
    let noteId = "";

    try {
      const unique = Date.now();
      const originalTitle = `Automation Note ${unique}`;
      const originalText = `Created by Playwright automation ${unique}`;
      const updatedTitle = `Updated Automation Note ${unique}`;
      const updatedText = `Updated by Playwright automation ${unique}`;

      // Create: save the new note id so the rest of the test can use the same record.
      const created = await createTestNote(api, {
        title: originalTitle,
        text: originalText,
      });

      noteId = created.noteId;
      expect(created.note.title).toBe(originalTitle);
      expect(created.note.text).toBe(originalText);

      // Read by id: prove the note can be fetched directly after creation.
      const getResponse = await api.get(`/notes/${noteId}`);
      const getBody = await getResponse.json();

      expect(getResponse.status()).toBe(200);
      expect(getBody.ok).toBe(true);
      expect(String(getBody.note._id || getBody.note.id)).toBe(String(noteId));
      expect(getBody.note.title).toBe(originalTitle);

      // Read list: prove the note appears in the authenticated user's note list.
      const listResponse = await api.get("/notes/list");
      const listBody = await listResponse.json();

      expect(listResponse.status()).toBe(200);
      expect(listBody.ok).toBe(true);
      expect(Array.isArray(listBody.notes)).toBe(true);
      expect(listBody.notes.some((note) => String(note._id || note.id) === String(noteId))).toBe(true);

      // Update: change the saved note and verify the updated fields come back.
      const updateResponse = await api.put(`/notes/${noteId}`, {
        data: {
          title: updatedTitle,
          text: updatedText,
        },
      });
      const updateBody = await updateResponse.json();

      expect(updateResponse.status()).toBe(200);
      expect(updateBody.ok).toBe(true);
      expect(updateBody.note.title).toBe(updatedTitle);
      expect(updateBody.note.text).toBe(updatedText);

      // Delete: remove the note and verify it can no longer be fetched.
      const deleteResponse = await api.delete(`/notes/${noteId}`);
      const deleteBody = await deleteResponse.json();

      expect(deleteResponse.status()).toBe(200);
      expect(deleteBody.ok).toBe(true);

      const getDeletedResponse = await api.get(`/notes/${noteId}`);
      expect(getDeletedResponse.status()).toBe(404);

      noteId = "";
    } finally {
      await deleteIfPresent(api, noteId);
      await api.dispose();
    }
  });
});
