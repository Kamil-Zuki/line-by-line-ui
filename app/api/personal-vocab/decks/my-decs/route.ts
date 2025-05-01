import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/deck/my-decks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch decks" }, { status: res.status });
    }

    const decks = await res.json();
    return NextResponse.json(decks);
  } catch (error) {
    console.error("Error fetching decks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}