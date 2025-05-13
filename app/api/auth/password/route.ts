import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_URL = `${process.env.API_SERVER_ADDRESS}/api/v1/auth/password`;

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const body = await req.json();

  //   console.log("Password endpoint:", currentPassword, newPassword);
  console.log("Password endpoint:", body);

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(API_URL, {
      method: "PUT",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to update password info" },
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
