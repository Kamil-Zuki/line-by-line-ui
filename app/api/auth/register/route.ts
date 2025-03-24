import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, confirmPassword } = await req.json();
  const res = await fetch("http://85.175.218.17/api/v1/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, confirmPassword }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });

  const data = await res.json();
  const response = NextResponse.json({ message: "Registration successful" });
  response.cookies.set("accessToken", data.accessToken, {
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  response.cookies.set("refreshToken", data.refreshToken, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
