import { NextRequest, NextResponse } from "next/server";

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
    // Use Next.js API proxy instead of direct backend call
    const res = await fetch(new URL("/api/auth/me", req.url), {
      method: "GET",
      headers: { Cookie: `accessToken=${token}` }, // Pass cookie explicitly
    });

    if (!res.ok) {
      console.log(`Token validation failed with status: ${res.status}`);
      // return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await res.json();
    console.log("Token validated:", { id: user.id, name: user.userName });

    if (req.nextUrl.pathname === "/") {
      console.log("Root accessed, redirecting to /dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const response = NextResponse.next();
    response.headers.set("x-user-id", user.id);
    response.headers.set("x-user-name", user.userName);
    console.log("Token valid, proceeding with request");
    return response;
  } catch (err) {
    console.error("Error validating token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/personal-vocab/:path*", "/"],
};
