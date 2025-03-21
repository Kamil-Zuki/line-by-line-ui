import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendRes = await fetch("http://85.175.218.17/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      console.log(errorData);
      return NextResponse.json(
        { error: errorData.error || "Login failed" },
        { status: backendRes.status }
      );
    }

    const { accessToken, refreshToken } = await backendRes.json();

    // Set cookies
    const cookieOptions = "Path=/; HttpOnly; SameSite=Strict";
    return NextResponse.json(
      { accessToken, refreshToken },
      {
        headers: {
          "Set-Cookie": [
            `accessToken=${accessToken}; ${cookieOptions}; Max-Age=900`, // 15 minutes
            `refreshToken=${refreshToken}; ${cookieOptions}; Max-Age=604800`, // 7 days
          ].join(","),
        },
      }
    );
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
