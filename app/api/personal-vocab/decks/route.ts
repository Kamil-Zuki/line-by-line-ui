import { NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck";

export async function GET(req: Request) {
  try {
    // Extract the token from the request headers
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      );
    }

    // Forward request to the external API
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: authHeader, // Pass the token
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch decks: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
