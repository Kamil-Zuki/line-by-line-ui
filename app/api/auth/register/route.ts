import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    const res = await fetch("http://localhost:5027/api/v1/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || "Registration failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
