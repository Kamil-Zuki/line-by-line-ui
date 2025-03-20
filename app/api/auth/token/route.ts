import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { refreshToken } = await request.json();

  const res = await fetch("http://85.175.218.17/api/v1/auth/refresh-token", {
    method: "POST",
    headers: {
      Accept: "text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) {
    const error = await res.text();
    return NextResponse.json(
      { error: error || "Token refresh failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data); // { accessToken, refreshToken }
}
