import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1"; // Adjust if using env variable

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  console.log(accessToken);
  // Check for accessToken
  if (!accessToken) {
    console.log("No accessToken found in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Proxy request to personal_vocab microservice
    const res = await fetch(`${BASE_URL}/deck/my-decks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // Handle non-200 responses
    if (!res.ok) {
      console.log(`Backend responded with status: ${res.status}`);
      return NextResponse.json(
        { error: "Failed to fetch decks" },
        { status: res.status }
      );
    }

    const decks = await res.json();
    console.log("Decks fetched from backend:", decks); // Debug log
    return NextResponse.json(decks);
  } catch (error) {
    console.error("Error fetching decks from personal_vocab:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
