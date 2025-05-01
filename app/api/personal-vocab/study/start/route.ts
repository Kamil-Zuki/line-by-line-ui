//app\api\personal-vocab\study\start\route.ts
import { NextRequest, NextResponse } from "next/server";

const API_URL = 'http://85.175.218.17/api/v1/study/start'

export async function POST(
    req: NextRequest
  ) {
    //#region Access token
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    //#endregion
  
    try {
      const body = await req.json();
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to start session" },
          { status: response.status }
        );
      }
      const result = await response.json();
      return NextResponse.json(result, {status: 200});
    } catch (error) {
      console.error("Error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }