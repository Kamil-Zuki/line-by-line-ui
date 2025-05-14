import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/card/next`;

export async function GET(req: NextRequest) {
  //#region Access token
  const accessToken = req?.cookies.get("accessToken")?.value;
  if (!accessToken)
    return NextResponse.json({ error: "Failed to log in" }, { status: 401 });
  //#endregion

  console.log("The method next started");
  const response = await fetch(`${API_URL}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/json",
    },
  });

  console.log(response);
  if (!response.ok)
    return NextResponse.json({ error: "Failed to get cards" }, { status: 500 });

  const result = await response.json();

  return NextResponse.json(result, { status: 200 });
}
