import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1";

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(`${BASE_URL}/contribution`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to create contribution" },
        { status: res.status }
      );
    }

    const contribution = await res.json();
    return NextResponse.json(contribution);
  } catch (error) {
    console.error("Error creating contribution:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
