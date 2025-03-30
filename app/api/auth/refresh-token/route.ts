import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.bodyUsed) {
      console.warn("Request body already used.");
      return NextResponse.json({ error: "Request body already consumed" }, { status: 400 });
    }

    const contentLength = req.headers.get("content-length");
    if (!contentLength || parseInt(contentLength) === 0) {
      console.warn("Empty request body.");
      return NextResponse.json({ error: "Request body cannot be empty" }, { status: 400 });
    }

    const body = await req.json();
    console.log("Refresh token method:", body);

    const backendRes = await fetch("http://85.175.218.17/api/v1/auth/refresh-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log(backendRes);
    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      return NextResponse.json(
        { error: errorData.error || "Token refresh failed" },
        { status: backendRes.status }
      );
    }

    const { accessToken, refreshToken } = await backendRes.json();
    const cookieOptions = "Path=/; HttpOnly; SameSite=Strict; Secure";

    const headers = new Headers();
    headers.append("Set-Cookie", `refreshToken=${refreshToken}; ${cookieOptions}; Max-Age=604800`);
    headers.append("Set-Cookie", `accessToken=${accessToken}; ${cookieOptions}; Max-Age=900`);

    return new NextResponse(JSON.stringify({ accessToken }), { status: 200, headers });
  } catch (error) {
    console.error("Token proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
