import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1";

export async function GET(req: NextRequest, { params }: { params: { deckId: string } }) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${BASE_URL}/deck-version/deck/${params.deckId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch deck versions" }, { status: res.status });
    }

    const versions = await res.json();
    return NextResponse.json(versions);
  } catch (error) {
    console.error("Error fetching deck versions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}