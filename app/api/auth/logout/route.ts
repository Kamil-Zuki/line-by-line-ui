import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json(
      { error: "Missing authentication tokens" },
      { status: 401 }
    );
  }

  try {
    const backendResponse = await fetch(
      "http://85.175.218.17/api/v1/auth/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: "Logout failed", details: errorData },
        { status: backendResponse.status }
      );
    }

    // Clear cookies on successful logout
    return NextResponse.json(
      { message: "Logged out successfully" },
      {
        headers: {
          "Set-Cookie": [
            "accessToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict",
            "refreshToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict",
          ].join(","),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error during logout" },
      { status: 500 }
    );
  }
}
