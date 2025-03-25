import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("Received deck creation request:", body);

  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken) {
    console.log("No accessToken in cookies");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("http://85.175.218.17/api/v1/deck", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.log(`Backend responded with ${res.status}: ${errorText}`);
      return NextResponse.json(
        { error: errorText || "Backend error" },
        { status: res.status }
      );
    }

    const deck = await res.json();
    console.log("Deck created on backend:", deck);
    return NextResponse.json(deck);
  } catch (error: any) {
    console.error("Proxy error:", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
