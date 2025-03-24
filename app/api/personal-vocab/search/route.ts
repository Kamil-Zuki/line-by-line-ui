import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const deckId = searchParams.get("deckId");

  try {
    const url = deckId
      ? `${BASE_URL}/search/cards?query=${query}&deckId=${deckId}`
      : `${BASE_URL}/search/decks?query=${query}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Search failed" },
        { status: res.status }
      );
    }

    const results = await res.json();
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
