import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const backendResponse = await fetch(
    "http://85.175.218.17/api/v1/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!backendResponse.ok) {
    const error = await backendResponse.json();
    return NextResponse.json(error, { status: 401 });
  }

  const data = await backendResponse.json();

  // Optionally set token as cookie
  const response = NextResponse.json(data);
  response.headers.set(
    "Set-Cookie",
    `accessToken=${data.accessToken}; Path=/; HttpOnly; Max-Age=900`
  );

  return response;
}
