import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/search/cards";

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
     //#endregion

  try {
    const deckId = req?.nextUrl.searchParams.get("deckId");
    if (!deckId)
        return NextResponse.json({ error: "deckId is required" }, { status: 400 });

    const query = req?.nextUrl.searchParams.get("query");
    if(!query)
        return NextResponse.json({error:"query is required"}, { status: 400 });

    const response = await fetch(`${API_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok)
      throw NextResponse.json(
        { error: "Failed" },
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