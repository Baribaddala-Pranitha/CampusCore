export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    let parsedMessage = text;
    try {
      const json = JSON.parse(text);
      parsedMessage = json.error || json.message || text;
    } catch (e) {
      // Not JSON
    }
    throw new Error(parsedMessage || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: async (path: string, init?: RequestInit) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      ...(init?.headers || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
    return handleResponse(res);
  },
  post: async (path: string, body: any, init?: RequestInit) => {
    const token = localStorage.getItem("token");
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: init?.method || "POST",
      ...init,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse(res);
  },
};
