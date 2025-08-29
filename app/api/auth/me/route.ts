import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/auth/me`;

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch user info" },
        { status: res.status }
      );
    }

    const user = await res.json();
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
