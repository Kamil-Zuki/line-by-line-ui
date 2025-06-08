// app/lib/api.ts
import { useAuth } from "../hooks/useAuth";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  basePath: string = "/api/personal-vocab"
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const url = `${basePath}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  try {
    console.log("Fetching:", url);
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Rely on httpOnly accessToken cookie
      cache: "no-store", // Ensure fresh data
    });
    
    if (!res.ok) {
      let errorBody: string;
      try {
        errorBody = await res.text();
      } catch {
        errorBody = "Unable to read error response";
      }

      console.error(`API request failed: ${res.status} ${res.statusText}`, {
        url,
        method: options.method || "GET",
        headers,
        body: options.body,
        errorBody,
      });

      let errorMessage: string;
      switch (res.status) {
        case 400:
          errorMessage = `Bad request: ${errorBody || "Invalid data provided"}`;
          break;
        case 401:
          errorMessage = `Unauthorized: ${
            errorBody || "Authentication required"
          }`;
          break;
        case 403:
          errorMessage = `Forbidden: ${errorBody || "Access denied"}`;
          break;
        case 404:
          errorMessage = `Not found: ${errorBody || "Resource not available"}`;
          break;
        case 500:
          errorMessage = `Server error: ${
            errorBody || "Internal server issue"
          }`;
          break;
        default:
          errorMessage = errorBody
            ? `API error: ${errorBody}`
            : `API request failed with status ${res.status}`;
      }

      const error = new Error(errorMessage) as Error & { status?: number };
      error.status = res.status; // Attach status for downstream handling
      throw error;
    }

    
    // Handle cases where response might not be JSON
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log("Handle cases where response might not be JSON")
      return data as T;
    } else {
      const text = await res.text();
      console.warn(`Non-JSON response from ${url}:`, text);
      return text as unknown as T; // Fallback to text, cast to T (use with caution)
    }
  } catch (error: any) {
    console.error("Network or fetch error:", {
      url,
      method: options.method || "GET",
      message: error.message,
      stack: error.stack,
    });
    throw error instanceof Error
      ? error
      : new Error(`Fetch failed: ${String(error)}`);
  }
}

// Hook-based API client for authenticated requests
export function useApi(basePath: string = "/api/personal-vocab") {
  const { loading, isAuthenticated } = useAuth(); // Include isAuthenticated

  return {
    get: <T>(endpoint: string) =>
      loading || !isAuthenticated
        ? Promise.reject(new Error("Authentication in progress or failed"))
        : fetchApi<T>(endpoint, { method: "GET" }, basePath),
    post: <T>(endpoint: string, body: any) =>
      loading || !isAuthenticated
        ? Promise.reject(new Error("Authentication in progress or failed"))
        : fetchApi<T>(
            endpoint,
            { method: "POST", body: JSON.stringify(body) },
            basePath
          ),
    put: <T>(endpoint: string, body: any) =>
      loading || !isAuthenticated
        ? Promise.reject(new Error("Authentication in progress or failed"))
        : fetchApi<T>(
            endpoint,
            { method: "PUT", body: JSON.stringify(body) },
            basePath
          ),
    delete: <T>(endpoint: string) =>
      loading || !isAuthenticated
        ? Promise.reject(new Error("Authentication in progress or failed"))
        : fetchApi<T>(endpoint, { method: "DELETE" }, basePath),
  };
}
