import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, confirmPassword } = await request.json();

    // Basic validation
    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const res = await fetch("http://85.175.218.17/api/v1/auth/register", {
      method: "POST",
      headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });

    // Handle failed responses
    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Registration failed" },
        { status: res.status }
      );
    }

    // Success
    const data = await res.json();
    return NextResponse.json(data); // { message: "Confirm your email" }
  } catch (error) {
    // Catch network/server errors
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
