// app/api/personal-vocab/card/due/route.ts
import { NextRequest, NextResponse } from "next/server";
const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/card`;

export async function GET(req: NextRequest) {
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const deckId = searchParams.get("deckId");
  const sortBy = searchParams.get("sortBy");
  const skill = searchParams.get("skill");
  const mode = searchParams.get("mode");

  if (!deckId) {
    return NextResponse.json({ error: "deckId is required" }, { status: 400 });
  }

  const queryParams = new URLSearchParams();
  queryParams.append("deckId", deckId);
  if (sortBy) queryParams.append("sortBy", sortBy);
  if (skill) queryParams.append("skill", skill);
  if (mode) queryParams.append("mode", mode);

  try {
    const response = await fetch(`${API_URL}/due?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch due cards" },
        { status: response.status }
      );
    }

    const dueCards = await response.json();
    return NextResponse.json(dueCards, { status: 200 });
  } catch (error) {
    console.error("Error fetching due cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
