import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("http://localhost:5027/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
