import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-SECRET-here";
const JWT_ISSUER = process.env.JWT_SECRET || "your-ISSUER-here";
const JWT_AUDIENCE = process.env.JWT_SECRET || "your-AUDIENCE-here";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  console.log(`Middleware processing: ${req.nextUrl.pathname}`);

  const publicRoutes = ["/login", "/register", "/api/auth"];
  if (publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    console.log("Public route accessed, skipping auth check");
    return NextResponse.next();
  }

  if (!token) {
    console.log("No accessToken found in cookies");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    }) as { exp: number; sub: string; name: string; jti: string };

    console.log("Token decoded:", {
      sub: decoded.sub,
      name: decoded.name,
      exp: decoded.exp,
      jti: decoded.jti,
    });

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      console.log("Token expired, redirecting to login");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.nextUrl.pathname === "/") {
      console.log("Root accessed, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", decoded.sub);
    response.headers.set("x-user-name", decoded.name);
    console.log("Token valid, proceeding with request");
    return response;
  } catch (err) {
    console.error("JWT validation error:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/personal-vocab/:path*", "/"],
};
