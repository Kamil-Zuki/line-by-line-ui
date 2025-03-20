// Import necessary modules and dependencies
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// JWT configuration from your settings
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_ISSUER = process.env.JWT_ISSUER || "";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "";

// Middleware function for authentication and authorization
export async function middleware(req: NextRequest) {
  try {
    // Retrieve the auth token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    // Allow public routes to bypass middleware
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/api/auth") ||
      req.nextUrl.pathname === "/login" // Add any other public routes
    ) {
      return NextResponse.next();
    }

    // Redirect to /login if no token is present
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verify JWT with secret, issuer, and audience
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as { exp: number; userId: string };

    const currentTime = Math.floor(Date.now() / 1000);

    // Redirect to /login if token is expired
    if (decoded.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect root (/) to /dashboard for valid tokens
    if (req.nextUrl.pathname === "/" && decoded.exp > currentTime) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Pass userId to downstream requests (e.g., API routes)
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.userId);
    return response;
  } catch (err) {
    console.error("JWT validation error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Configuration to protect specific routes
export const config = {
  matcher: [
    "/dashboard/:path*", // Dashboard pages
    "/api/personal-vocab/:path*", // Vocab API routes
    "/", // Root path
  ],
};
