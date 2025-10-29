// app/lib/api.ts
import { useAuth } from "../hooks/useAuth";

// Helper to get cookie value (for non-httpOnly cookies only)
const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
};

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  basePath: string = "/personal-vocab"
): Promise<T> {
  // Always use Next.js API routes (which proxy to backend) instead of calling backend directly
  // This ensures cookies are forwarded properly
  // basePath should be relative to /api (e.g., "/personal-vocab" not "/api/personal-vocab")
  const url = `/api${basePath}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    console.log("Fetching:", url);
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include cookies
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
export function useApi(basePath: string = "/personal-vocab") {
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
