import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/deck-subscription";

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     //#endregion

  try {
    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok)
      throw NextResponse.json(
        { error: "Failed to fetch deck subscriptions" },
        { status: response.status }
      );

    const result = await response.json();

    return NextResponse.json(result, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
