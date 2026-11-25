const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000/api";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    window.localStorage.getItem("qss_auth_token") ||
    window.localStorage.getItem("auth_token") ||
    window.localStorage.getItem("token")
  );
}

export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, string | undefined>
): Promise<T | null> {
  const normalizedPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value) {
        url.searchParams.set(key, value);
      }
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers,
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as { data?: T } | T;
    if (
      payload &&
      typeof payload === "object" &&
      "data" in payload &&
      payload.data !== undefined
    ) {
      return payload.data;
    }
    return payload as T;
  } catch {
    return null;
  }
}
