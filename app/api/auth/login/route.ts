import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const res = await fetch("http://85.175.218.17/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain", // Match your curl
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: res.status }
      );
    }

    const { accessToken, refreshToken } = await res.json();

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("accessToken", accessToken, {
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    response.cookies.set("refreshToken", refreshToken, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
