// app/api/personal-vocab/study/end/[sessionId]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/study/end";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;
    console.log("sessionId", id);

    const response = await fetch(`${API_URL}/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(""),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to end session" },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("Study end", result);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}