// src/utils/apiFetch.js
export default async function apiFetch(path, options = {}) {
  const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined && options.body !== null;

  // Construye headers a partir de options.headers
  const headers = new Headers(options.headers || {});
  if (!isFormData && hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Accept")) headers.set("Accept", "application/json");

  // Prepara body (sin doble stringify)
  let body = options.body;
  if (hasBody && !isFormData && typeof body !== "string") {
    body = JSON.stringify(body);
  }

  // MUY IMPORTANTE: spread primero, override después
  let fetchOptions = {
    ...options, // 👈 primero
    method: options.method || "GET",
    headers,    // 👈 nuestros headers ganan
    credentials: options.credentials ?? "include",
    ...(hasBody ? { body } : {}), // no mandes body en GETs sin body
  };

  let res = await fetch(`${baseURL}${path}`, fetchOptions);

  // Refresh token si 401
  if (res.status === 401) {
    try {
      const r = await fetch(`${baseURL}/api/auth/refresh`, { // 👈 baseURL
        method: "POST",
        credentials: "include",
      });
      if (r.ok) {
        // si tu backend devuelve nuevo token en JSON, guárdalo
        try {
          const data = await r.json();
          if (data?.token) localStorage.setItem("token", data.token);
        } catch {}
        // reintenta
        const newToken = localStorage.getItem("token");
        if (newToken) headers.set("Authorization", `Bearer ${newToken}`);
        fetchOptions = { ...fetchOptions, headers };
        res = await fetch(`${baseURL}${path}`, fetchOptions);
      }
    } catch {}
    if (res.status === 401) {
      localStorage.removeItem("token");
      throw new Error("401 Unauthorized");
    }
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${text}`);
  }

  const ct = res.headers.get("content-type") || "";
  if (res.status === 204) return null;
  return ct.includes("application/json") ? res.json() : res.blob();
}
