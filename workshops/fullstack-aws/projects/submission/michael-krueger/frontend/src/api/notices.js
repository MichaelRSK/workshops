// The backend's base URL, read from the environment rather than written in
// here. The API lives on localhost during development and behind API
// Gateway or CloudFront once deployed, and those are facts about a
// particular environment, not about this code.
//
// Vite only exposes variables whose names start with VITE_, and it inlines
// them at build time rather than reading them at runtime. So changing .env
// means restarting the dev server, and a production build bakes in whatever
// was set when it was built.
//
// The trailing slash is stripped so that both "http://localhost:8001" and
// "http://localhost:8001/" work. Without this the second form would build
// "http://localhost:8001//notices", which some servers answer and others
// reject, and it is an unpleasant thing to have to debug.
const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

// Pulls a readable message out of an error response.
//
// FastAPI sends "detail" in two different shapes and this has to cope with
// both. Our own HTTPException calls send a plain string, but a body that
// fails Pydantic validation produces a list of objects like
// [{ loc, msg, type }] instead. Handing that list straight to a MUI Alert
// would crash the render with "Objects are not valid as a React child", so
// the list is flattened into one sentence here.
//
// The status code is the fallback, because a failure with no explanation is
// still worth showing rather than swallowing.
function extractErrorMessage(body, status) {
  const detail = body?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean);

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return `The request failed with status ${status}.`;
}

// The single place every call to the backend goes through.
//
// Wrapping fetch is worth it because fetch has one surprising behaviour: it
// only rejects on a network failure, not on a 404 or a 500. Without the
// response.ok check below, a failed delete would look exactly like a
// successful one to the caller.
//
// Throws an Error with a message fit to show the user. Every caller in the
// components catches it and puts it in an Alert.
async function request(path, options = {}) {
  // A missing VITE_API_URL would otherwise produce a request to
  // "undefined/notices" and a confusing 404 from the dev server itself.
  // Saying so plainly is more useful than letting that happen.
  if (!API_URL) {
    throw new Error(
      "VITE_API_URL is not set. Copy .env.example to .env and restart the dev server."
    );
  }

  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch rejects here when the request never got an answer at all: the
    // backend is not running, the URL is wrong, or CORS blocked it. The
    // browser deliberately hides which, so this message covers all three
    // rather than guessing.
    throw new Error(
      "Could not reach the API. Check that the backend is running and that VITE_API_URL is correct."
    );
  }

  if (!response.ok) {
    // The error body is not guaranteed to be JSON. A crash in the server or
    // a proxy in front of it can return HTML, and trying to parse that
    // would throw and hide the real status code, so a failure to parse
    // falls back to an empty object.
    const body = await response.json().catch(() => ({}));

    throw new Error(extractErrorMessage(body, response.status));
  }

  // 204 means "done, nothing to send back", which is what DELETE answers.
  // Calling response.json() on an empty body throws, so it is skipped.
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// GET /notices
// Returns the notices as an array of { id, name, message, created_at },
// already sorted newest first by the backend.
export async function listNotices() {
  return request("/notices");
}

// POST /notices
// Creates one notice and returns the created row, which is what gives the
// caller the generated id and created_at.
export async function createNotice({ name, message }) {
  return request("/notices", {
    method: "POST",
    body: JSON.stringify({ name, message }),
  });
}

// DELETE /notices/{id}
// Returns nothing on success. A 404 means the notice was already deleted,
// which arrives here as a thrown Error like any other failure.
export async function deleteNotice(id) {
  return request(`/notices/${id}`, {
    method: "DELETE",
  });
}
