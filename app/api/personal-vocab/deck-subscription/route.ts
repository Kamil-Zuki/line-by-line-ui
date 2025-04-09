import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) throw new Error("There is no access token");
  try {
    const res = await fetch("/deck-subscription", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok)
      throw NextResponse.json(
        { error: "Failed to fetch deck subscriptions" },
        { status: res.status }
      );

    const deckSubs = await res.json();

    return NextResponse.json(deckSubs);
  } catch (error) {
    console.error("Error fetching public decks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
