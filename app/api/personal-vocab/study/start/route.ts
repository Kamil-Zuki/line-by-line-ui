// app/api/personal-vocab/study/start/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/study/start";

// Validate request body and extract deckId
const validateRequestBody = (body: any): { deckId: string } | null => {
  if (!body || typeof body !== "object" || !body.deckId || typeof body.deckId !== "string") {
    return null;
  }
  return { deckId: body.deckId };
};

export async function POST(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  console.log("study/start: Received access token:", accessToken);

  // Check authentication
  if (!accessToken) {
    console.log("study/start: Unauthorized - No access token provided");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Parse and validate request body
    const body = await req.json();
    console.log("study/start: Received request body:", body);

    const validatedBody = validateRequestBody(body);
    if (!validatedBody) {
      console.log("study/start: Invalid request body - deckId is required");
      return NextResponse.json({ error: "Invalid request: deckId is required" }, { status: 400 });
    }

    // Forward request to external API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedBody), // Only send validated deckId
    });

    console.log("study/start: External API response status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      console.log("study/start: External API error response:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to start session" },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("study/start: External API success response:", result);

    // Ensure the response matches the expected StartSessionResponse structure
    if (!result.sessionId || typeof result.sessionId !== "string") {
      console.log("study/start: Invalid response format - missing sessionId");
      return NextResponse.json(
        { error: "Invalid response from server: missing sessionId" },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("study/start: Unexpected error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}