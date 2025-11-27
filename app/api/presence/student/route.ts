import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// GET - Ambil list kehadiran dengan filter & pagination
export async function GET(request: NextRequest) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);

    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const pageParam = searchParams.get("page");
    const perPageParam = searchParams.get("perPage");

    // Default pagination
    const page = pageParam ? parseInt(pageParam) : 1;
    const perPage = perPageParam ? parseInt(perPageParam) : 10;
    const skip = (page - 1) * perPage;

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
        // kalau hanya startDate, endDate = startDate + 1 hari
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
      }
    }

    // Filter tanggal (jika ada)
    const where: any = {};
    if (startDate && endDate) {
      where.presenceAt = {
        gte: startDate,
        lt: endDate,
      };
    }

    // Hitung total data
    const totalData = await prisma.studentPresence.count({ where });

    // Ambil data kehadiran
    const presences = await prisma.studentPresence.findMany({
      where,
      include: {
        student: {
          select: { id: true, name: true, grade: true },
        },
        pic: {
          select: { id: true, username: true, role: true },
        },
      },
      orderBy: { presenceAt: "desc" },
      skip,
      take: perPage,
    });

    const totalPage = Math.ceil(totalData / perPage);

    return NextResponse.json({
      status: true,
      data: presences,
      pagination: {
        page,
        perPage,
        totalPage,
        totalData,
      },
    });
  } catch (error) {
    console.error("Get presence list error:", error);
    return NextResponse.json(
      {
        status: false,
        error: "Terjadi kesalahan saat mengambil data kehadiran",
      },
      { status: 500 }
    );
  }
}
