// api/students/export/route.ts
// ============================================

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/students/export
 * Export students data to CSV
 * Auth: OWNER, ACADEMIC only
 */
export async function GET(request: NextRequest) {
  try {
    const { error, user } = await requireAuth(request, ["OWNER", "ACADEMIC"]);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const grade = searchParams.get("grade");

    const where: any = {
      deletedAt: null,
    };

    if (status) where.status = status;
    if (grade) where.grade = grade;

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        name: true,
        gender: true,
        address: true,
        phoneNumber: true,
        fatherName: true,
        motherName: true,
        grade: true,
        status: true,
        createdAt: true,
      },
    });

    // Convert to CSV
    const headers = [
      "Nama",
      "Jenis Kelamin",
      "Alamat",
      "No. Telepon",
      "Nama Ayah",
      "Nama Ibu",
      "Kelas",
      "Status",
      "Tanggal Daftar",
    ];

    const rows = students.map((s) => [
      s.name,
      s.gender === "MALE" ? "Laki-laki" : "Perempuan",
      s.address,
      s.phoneNumber || "",
      s.fatherName || "",
      s.motherName || "",
      s.grade || "",
      s.status,
      new Date(s.createdAt).toLocaleDateString("id-ID"),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="siswa-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export students error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengekspor data siswa",
      },
      { status: 500 }
    );
  }
}
