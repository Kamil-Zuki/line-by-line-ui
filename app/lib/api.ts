import { useAuth } from "../hooks/useAuth";

// Utility to fetch data from the personal_vocab microservice via Next.js API routes
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  // Base headers with Content-Type and optional Authorization
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Construct the full URL (relative to Next.js API proxy)
  const url = `/api/personal-vocab${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // Include httpOnly cookies (e.g., accessToken)
      cache: "no-store", // Ensure fresh data for authenticated requests
    });

    if (!res.ok) {
      // Attempt to parse error body (could be JSON or plain text)
      let errorBody: string;
      try {
        errorBody = await res.text();
      } catch (textError) {
        errorBody = "Unable to read error response";
      }

      // Log detailed error info for debugging
      console.error(`API request failed: ${res.status} ${res.statusText}`, {
        url,
        method: options.method || "GET",
        headers,
        body: options.body,
        errorBody,
      });

      // Customize error message based on status
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

      throw new Error(errorMessage);
    }

    // Parse and return JSON response
    const data = await res.json();
    return data as T;
  } catch (error: any) {
    // Handle network errors or fetch failures
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
export function useApi() {
  const { tokens } = useAuth(); // Assumes useAuth provides tokens

  return {
    get: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, { method: "GET" }, tokens.accessToken),
    post: <T>(endpoint: string, body: any) =>
      fetchApi<T>(
        endpoint,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
        tokens.accessToken
      ),
    put: <T>(endpoint: string, body: any) =>
      fetchApi<T>(
        endpoint,
        {
          method: "PUT",
          body: JSON.stringify(body),
        },
        tokens.accessToken
      ),
    delete: <T>(endpoint: string) =>
      fetchApi<T>(endpoint, { method: "DELETE" }, tokens.accessToken),
  };
}

// Optional: Type definitions for common API responses
export interface ApiError {
  error: string;
  details?: Record<string, any>;
}

export interface DeckResponse {
  id: string;
  title: string;
  description?: string;
  isPublic: boolean;
  tags: string[];
  ownerId: string;
  createdDate: string;
}
