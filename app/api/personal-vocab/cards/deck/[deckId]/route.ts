import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Handle dynamic rendering

export async function GET(
  req: NextRequest,
  { params }: { params: { deckId: string } }
) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Fetching cards for deckId:", params.deckId);
    const res = await fetch(
      `http://85.175.218.17/api/v1/card/${params.deckId}/cards`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend responded with ${res.status}: ${errorText}`);
      return NextResponse.json(
        { error: "Failed to fetch cards", details: errorText },
        { status: res.status }
      );
    }
    return NextResponse.json(await res.json());
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
