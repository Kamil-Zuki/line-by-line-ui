//app\api\personal-vocab\card\next\route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1/card/next";

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion
    console.log("nextd")
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  console.log(response)
  console.log("nextd2")
  if (!response.ok)
    return NextResponse.json(
      { error: "Failed to get the next card" },
      { status: 500 }
    );

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
