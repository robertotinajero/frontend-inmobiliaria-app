// src/utils/apiFetch.js
export default async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const res = await fetch(`${baseURL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error HTTP ${res.status}: ${errorText}`);
  }

  return res.json();
}
