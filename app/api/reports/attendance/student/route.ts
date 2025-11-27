import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Validasi tanggal
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { status: false, error: "Format startDate tidak valid" },
          { status: 400 }
        );
      }
      if (endDateParam) {
        endDate = new Date(endDateParam);
        if (isNaN(endDate.getTime())) {
          return NextResponse.json(
            { status: false, error: "Format endDate tidak valid" },
            { status: 400 }
          );
        }
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
      }
    }

    // Filter tanggal
    const where: any = {};
    if (startDate && endDate) {
      where.presenceAt = { gte: startDate, lt: endDate };
    }

    // Ambil semua data dalam range
    const presences = await prisma.studentPresence.findMany({
      where,
      include: {
        student: { select: { id: true, name: true, grade: true } },
      },
      orderBy: { presenceAt: "asc" },
    });

    if (!presences.length) {
      return NextResponse.json({
        status: true,
        message: "Tidak ada data kehadiran dalam rentang waktu ini",
        data: {
          summary: {},
          chartData: [],
          topStudents: [],
        },
      });
    }

    // --- Analisis data ---
    const total = presences.length;
    const totalHadir = presences.filter((p) => p.type === 1).length;
    const totalIzin = presences.filter((p) => p.type === 2).length;
    const totalSakit = presences.filter((p) => p.type === 3).length;
    const totalAlpa = presences.filter((p) => p.type === 4).length;

    // Persentase
    const summary = {
      total,
      hadir: totalHadir,
      izin: totalIzin,
      sakit: totalSakit,
      alpa: totalAlpa,
      percentHadir: Number(((totalHadir / total) * 100).toFixed(1)),
      percentIzin: Number(((totalIzin / total) * 100).toFixed(1)),
      percentSakit: Number(((totalSakit / total) * 100).toFixed(1)),
      percentAlpa: Number(((totalAlpa / total) * 100).toFixed(1)),
    };

    // --- Data untuk grafik (Recharts) ---
    // Format: [{ date: "2025-11-01", HADIR: 10, IZIN: 2, SAKIT: 1, ALPA: 0 }]
    const groupedByDate: Record<string, any> = {};

    for (const p of presences) {
      const dateKey = p.presenceAt.toISOString().split("T")[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          HADIR: 0,
          IZIN: 0,
          SAKIT: 0,
          ALPA: 0,
        };
      }
      groupedByDate[dateKey][p.type] += 1;
    }

    const chartData = Object.values(groupedByDate);

    // --- Top 5 Siswa Kehadiran Terbaik & Terburuk ---
    const studentStats: Record<
      string,
      { name: string; hadir: number; total: number }
    > = {};

    for (const p of presences) {
      const id = p.student.id;
      if (!studentStats[id]) {
        studentStats[id] = {
          name: p.student.name,
          hadir: 0,
          total: 0,
        };
      }
      studentStats[id].total += 1;
      if (p.type === 1) studentStats[id].hadir += 1;
    }

    const studentArray = Object.entries(studentStats).map(([id, s]) => ({
      id,
      name: s.name,
      hadir: s.hadir,
      total: s.total,
      percentHadir: Number(((s.hadir / s.total) * 100).toFixed(1)),
    }));

    const topStudents = [...studentArray]
      .sort((a, b) => b.percentHadir - a.percentHadir)
      .slice(0, 5);

    const lowStudents = [...studentArray]
      .sort((a, b) => a.percentHadir - b.percentHadir)
      .slice(0, 5);

    // --- Response ---
    return NextResponse.json({
      status: true,
      data: {
        summary,
        chartData,
        topStudents,
        lowStudents,
      },
    });
  } catch (error) {
    console.error("Get attendance report error:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Terjadi kesalahan saat mengambil laporan kehadiran",
      },
      { status: 500 }
    );
  }
}
