import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// JWT config (you can remove issuer/audience check if not needed)
const JWT_SECRET = process.env.JWT_SECRET || "";
const JWT_ISSUER = process.env.JWT_ISSUER || "";
const JWT_AUDIENCE = process.env.JWT_AUDIENCE || "";

export async function middleware(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    // Allow public routes
    if (
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/api/auth") ||
      req.nextUrl.pathname === "/login"
    ) {
      return NextResponse.next();
    }

    // No token → redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER || undefined, // Optional
      audience: JWT_AUDIENCE || undefined, // Optional
    }) as { exp: number; sub: string; name: string };


    console.log(decoded);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect "/" to /dashboard if authenticated
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Pass user info (optional)
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.sub); // Using "sub" (subject) now!
    response.headers.set("x-user-name", decoded.name);
    return response;
  } catch (err) {
    console.error("JWT validation error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/personal-vocab/:path*", "/"],
};
