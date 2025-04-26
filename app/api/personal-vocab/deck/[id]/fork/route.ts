import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1/deck";


export async function POST(req: NextRequest, {params}: {params: Promise<{id: string }>}) {
   //#region Access token
   const accessToken = req?.cookies.get("accessToken")?.value;
   if (!accessToken)
     return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
   //#endregion

  try {
    const body = await req.json();

    const awaitedParams = await params;
    const id = awaitedParams.id;


    const response = await fetch(`${BASE_URL}/${id}/fork`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
