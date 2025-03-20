// File: /app/api/auth/login/route.ts

import { NextRequest, NextResponse } from "next/server";

const REAL_BACKEND_URL = "http://85.175.218.17/api/v1/auth/login";

export async function POST(req: NextRequest) {
  try {
    // Get body from client request
    const body = await req.json();

    // Forward request to real backend
    const realBackendResponse = await fetch(REAL_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await realBackendResponse.json();

    if (!realBackendResponse.ok) {
      // If backend returns error
      return NextResponse.json(
        { error: data.error || "Invalid credentials" },
        { status: realBackendResponse.status }
      );
    }

    // Optionally set cookies (accessToken, refreshToken)
    const response = NextResponse.json({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    // Set HttpOnly cookie (optional, depends on your frontend setup)
    response.headers.append(
      "Set-Cookie",
      `accessToken=${data.accessToken}; Path=/; HttpOnly; Max-Age=900`
    );

    // If you want to store refreshToken as cookie (optional)
    response.headers.append(
      "Set-Cookie",
      `refreshToken=${data.refreshToken}; Path=/; HttpOnly; Max-Age=604800` // 7 days
    );

    return response;
  } catch (error: any) {
    console.error("Login Proxy Error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
