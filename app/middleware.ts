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
    // Delegate token validation to the backend
    const res = await fetch("http://85.175.218.17/api/v1/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log(`Backend /auth/me rejected token with status: ${res.status}`);
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const user = await res.json();
    console.log("Token validated by backend:", {
      id: user.id,
      name: user.userName,
    });

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
    console.error("Error validating token with backend:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/personal-vocab/:path*", "/"],
};
