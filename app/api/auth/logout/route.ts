import { NextResponse } from "next/server";

export async function POST() {
  // Optionally call backend logout endpoint if it exists
  // await fetch('http://85.175.218.17/api/v1/auth/logout', { method: 'POST' });

  return NextResponse.json(
    { message: "Logged out" },
    {
      headers: {
        "Set-Cookie": [
          "accessToken=; Path=/; HttpOnly; Max-Age=0",
          "refreshToken=; Path=/; HttpOnly; Max-Age=0",
        ].join(","),
      },
    }
  );
}
