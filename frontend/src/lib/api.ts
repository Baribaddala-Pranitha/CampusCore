export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed with ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: async (path: string, init?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...init });
    return handleResponse(res);
  },
  post: async (path: string, body: any, init?: RequestInit) => {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      ...init,
    });
    return handleResponse(res);
  },
};


