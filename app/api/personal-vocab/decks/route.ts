import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck";

export async function GET(req: Request) {
  try {
    // Extract the Authorization token from the request headers
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Forward the request to the backend API with the token
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, // Pass the token to the backend
      },
    });

    if (!response.ok) throw new Error("Failed to fetch decks");

    const decks = await response.json();
    return NextResponse.json(decks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader
      : `Bearer ${authHeader}`;

    // ✅ Parse request body (matching the API's expected fields)
    const { title, imageUrl, description, groupId } = await req.json();

    if (!title || !groupId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Log outgoing request
    console.log("Sending request to API:", {
      title,
      imageUrl,
      description,
      groupId,
    });

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json-patch+json",
        Accept: "text/plain",
        Authorization: token,
      },
      body: JSON.stringify({ title, imageUrl, description, groupId }),
    });

    const responseText = await response.text();
    console.log("Backend response:", responseText);

    if (!response.ok) {
      throw new Error(`Failed to create deck: ${responseText}`);
    }

    return NextResponse.json(JSON.parse(responseText), { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
