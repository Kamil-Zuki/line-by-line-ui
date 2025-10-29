import { NextRequest, NextResponse } from "next/server";

const API_SERVER = process.env.API_SERVER_ADDRESS || "http://localhost:8090";
const BASE_URL = `${API_SERVER}/api/v1/deck/my-decks`;

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion
  
  try {
    console.log("Fetching from backend:", BASE_URL);
    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Backend response status:", response.status);

    if (!response.ok) {
      let errorMessage = "Failed";
      try {
        const errorData = await response.text();
        console.error("Backend error response:", errorData);
        errorMessage = errorData || "Failed";
      } catch (e) {
        console.error("Could not parse error response:", e);
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching from backend:", error.message, error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

