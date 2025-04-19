import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "http://85.175.218.17/api/v1/deck/public";


export async function GET(req: NextRequest) {
//#region Access token
   const accessToken = req?.cookies.get("accessToken")?.value;
   if (!accessToken)
     return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
   //#endregion

  try {

    const response = await fetch(`${BASE_URL}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
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
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
