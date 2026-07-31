/**
 * Base URL for the notice board API.
 * - Local dev: Vite proxies `/api` → http://localhost:3000
 * - Deployed: set VITE_API_URL (e.g. https://api.example.com)
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * GET /api/v1/notice
 * @returns {Promise<{ success: boolean, count: number, data: Notice[] }>}
 */
export async function fetchNotices() {
  const res = await fetch(`${API_BASE}/api/v1/notice`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Failed to load notices (${res.status})`);
  }

  return res.json();
}
