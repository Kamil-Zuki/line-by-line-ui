import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const res = await fetch("http://85.175.218.17/api/v1/auth/login", {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json(); // Read the body once
  console.log(data); // Log the parsed JSON

  if (!res.ok) {
    return NextResponse.json(
      { error: data.error || "Login failed" }, // Use data.error if available
      { status: res.status }
    );
  }

  return NextResponse.json(data); // { accessToken, refreshToken }
}
