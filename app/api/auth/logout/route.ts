import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Hapus cookie dengan set maxAge ke 0
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  const response = NextResponse.json({
    message: "Logout berhasil",
  });

  response.headers.set("Set-Cookie", cookie);

  return response;
}
