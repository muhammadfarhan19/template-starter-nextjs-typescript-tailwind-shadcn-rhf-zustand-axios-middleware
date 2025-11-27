import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    // Cek apakah ada body
    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { error: "Request body tidak boleh kosong" },
        { status: 400 }
      );
    }

    // Parse JSON
    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json(
        { error: "Format JSON tidak valid" },
        { status: 400 }
      );
    }

    const { username, email, phoneNumber, password, role } = body;

    // Validasi input
    if (!username || !email || !phoneNumber || !password || !role) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Validasi role
    const validRoles = ["OWNER", "ACADEMIC", "FINANCE", "HR"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Role tidak valid. Pilih: OWNER, ACADEMIC, FINANCE, atau HR" },
        { status: 400 }
      );
    }

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email atau username sudah terdaftar" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phoneNumber: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "User berhasil dibuat",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat user" },
      { status: 500 }
    );
  }
}
