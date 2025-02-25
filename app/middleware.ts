import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Function to decode JWT (without validating the signature)
const decodeJwt = (token: string) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Adjust for URL-safe base64
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies(); // Get cookies from the request
  const token = cookieStore.get("authToken")?.value; // Access the token from cookies

  if (!token) {
    // If there's no token, redirect to login page
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // Decode the token to check expiration
  try {
    const decodedToken = decodeJwt(token);

    // Get the token expiration time (exp) and compare with the current time
    const currentTime = Math.floor(Date.now() / 1000); // Current Unix timestamp
    const tokenExpTime = decodedToken.exp;

    if (tokenExpTime < currentTime) {
      // If the token has expired, redirect to login page
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } catch (err) {
    // If the token is malformed or decoding fails, redirect to login page
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // If everything is valid, continue with the request
  return NextResponse.next();
}

// Apply middleware to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/:path*"], // Protect all routes except login page
};
