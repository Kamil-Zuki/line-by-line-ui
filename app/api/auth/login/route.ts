// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_SERVER_ADDRESS;
const API_URL = `${API_BASE}/api/v1/auth/login`;

export async function POST(req: NextRequest) {
  try {
    if (!API_BASE) {
      return NextResponse.json(
        { message: "API_SERVER_ADDRESS is not configured" },
        { status: 500 }
      );
    }
    const { email, password } = await req.json();

    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const raw = await res.text();
      let errorMessage = "Invalid credentials";
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          errorMessage =
            parsed.Errors?.[0]?.ErrorMessage ||
            parsed.error ||
            parsed.message ||
            raw;
        } catch {
          errorMessage = raw;
        }
      }
      return NextResponse.json(
        { message: errorMessage },
        { status: res.status }
      );
    }

    // Try to parse successful response; support both JSON and plain text
    const okRaw = await res.text();
    let accessToken: string | undefined;
    let refreshToken: string | undefined;
    try {
      const parsed = JSON.parse(okRaw);
      accessToken = parsed.accessToken;
      refreshToken = parsed.refreshToken;
    } catch {
      // If backend returns non-JSON, we cannot extract tokens
    }

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { message: "Invalid response from auth service" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      message: "Login successful",
      refreshToken,
    });
    response.cookies.set("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true, // Securely set
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    response.cookies.set("refreshToken", refreshToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Readable for refresh
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
