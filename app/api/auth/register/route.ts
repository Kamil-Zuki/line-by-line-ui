import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const backendRes = await fetch(
      "http://85.175.218.17/api/v1/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      return NextResponse.json(
        { error: errorData.error || "Registration failed" },
        { status: backendRes.status }
      );
    }

    const data = await backendRes.json();
    // If backend auto-logs in and returns tokens, set cookies
    if (data.accessToken && data.refreshToken) {
      const cookieOptions = "Path=/; HttpOnly; SameSite=Strict";
      return NextResponse.json(data, {
        headers: {
          "Set-Cookie": [
            `accessToken=${data.accessToken}; ${cookieOptions}; Max-Age=900`,
            `refreshToken=${data.refreshToken}; ${cookieOptions}; Max-Age=604800`,
          ].join(","),
        },
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Register proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
