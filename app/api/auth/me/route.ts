import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const backendRes = await fetch("http://85.175.218.17/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch user" },
        { status: backendRes.status }
      );
    }

    const userData = await backendRes.json();
    return NextResponse.json({
      ...userData,
      accessToken,
      refreshToken: req.cookies.get("refreshToken")?.value,
    });
  } catch (error) {
    console.error("Me proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
