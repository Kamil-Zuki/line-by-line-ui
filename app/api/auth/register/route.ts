import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, confirmPassword } = await request.json();

  const res = await fetch("http://85.175.218.17/api/v1/auth/register", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json(
      { error: error || "Registration failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data); // { message: "Confirm your email" }
}
