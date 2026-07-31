const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function getNotices() {
  const response = await fetch(`${API_URL}/notices`);

  if (!response.ok) {
    throw new Error("Failed to load notices");
  }

  return response.json();
}

export async function createNotice(notice) {
  const response = await fetch(`${API_URL}/notices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notice),
  });

  if (!response.ok) {
    throw new Error("Failed to create notice");
  }

  return response.json();
}

export async function deleteNotice(noticeId) {
  const response = await fetch(`${API_URL}/notices/${noticeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete notice");
  }
}