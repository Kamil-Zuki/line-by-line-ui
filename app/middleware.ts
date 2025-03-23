import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-here"; // Ensure this is set in .env

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // Allow public routes
  const publicRoutes = ["/login", "/register", "/api/auth"];
  if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    console.log("No accessToken found in cookies");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { exp: number; sub: string; name: string };
    console.log("Token decoded:", decoded);

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("Token expired");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect "/" to /dashboard if authenticated
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Pass user info in headers
    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.sub);
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