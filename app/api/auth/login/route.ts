import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Import cookies API

const API_URL = "http://85.175.218.17/api/v1/auth/login";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const token = typeof data.data === "string" ? data.data : null;

    if (!token) {
      return NextResponse.json({ error: "No token received" }, { status: 500 });
    }

    // Set HTTP-only cookie
    const responseWithCookie = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    responseWithCookie.headers.set(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
    );
    return responseWithCookie;
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
