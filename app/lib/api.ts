// app/lib/api.ts
import { useAuth } from "../hooks/useAuth";

// Utility to fetch data from Next.js API routes
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  basePath: string = "/api/personal-vocab" // Default to personal_vocab
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const url = `${basePath}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  try {
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

      const error = new Error(errorMessage);
      (error as any).status = res.status; // Attach status for downstream handling
      throw error;
    }

    return (await res.json()) as T;
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
  const { loading } = useAuth(); // Use loading to delay calls until auth is ready

  return {
    get: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, { method: "GET" }, basePath),
    post: <T>(endpoint: string, body: any) =>
      fetchApi<T>(
        endpoint,
        { method: "POST", body: JSON.stringify(body) },
        basePath
      ),
    put: <T>(endpoint: string, body: any) =>
      fetchApi<T>(
        endpoint,
        { method: "PUT", body: JSON.stringify(body) },
        basePath
      ),
    delete: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, { method: "DELETE" }, basePath),
  };
}

// Type definitions for common API responses
export interface ApiError {
  error: string;
  status?: number; // For status code access
  details?: Record<string, any>;
}

export interface DeckResponse {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isPublic: boolean;
  ownerId: string;
  createdDate: string;
  lastReviewedDate: string;
  cardCount?: number; // Optional, pending backend confirmation
  tags: string[];
  isSubscribed: boolean;
}
