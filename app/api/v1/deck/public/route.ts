import { NextRequest, NextResponse } from "next/server";

const BASE_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/deck/public`;

export async function GET(req: NextRequest) {
  // Get access token from cookie (public endpoint might not require auth, but include it if available)
  const accessToken = req?.cookies.get("accessToken")?.value;

  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Add Authorization header if token is available
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || "Failed to fetch public decks" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching public decks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

