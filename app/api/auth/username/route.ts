import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = "http://85.175.218.17/api/v1";

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const body = await req.json();
  console.log(body);
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/auth/username`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });
    console.log(res)
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update password info" },
        { status: res.status }
      );
    }

    const result = await res.json();
    return NextResponse.json(result, {status: 200});
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
