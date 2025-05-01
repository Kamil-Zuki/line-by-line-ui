import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card";

export async function GET(req: NextRequest) {
  // #region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  }
  // #endregion

  // Get query parameters
  const { searchParams } = req.nextUrl;
  const deckId = searchParams.get("deckId");
  const sortBy = searchParams.get("sortBy");
  const skill = searchParams.get("skill");
  const mode = searchParams.get("mode");

  // Validate deckId
  if (!deckId) {
    return NextResponse.json({ error: "deckId is required" }, { status: 400 });
  }

  // Build the query string dynamically
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