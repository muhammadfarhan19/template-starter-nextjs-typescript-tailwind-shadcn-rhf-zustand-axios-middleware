import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

// POST - Buat kehadiran baru
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { error: "Request body tidak boleh kosong" },
        { status: 400 }
      );
    }

    const body = JSON.parse(text);
    const { studentId, presenceAt, dayOfWeek, type } = body;

    if (!studentId || !presenceAt || !type) {
      return NextResponse.json(
        { error: "Field studentId, presenceAt, dan type wajib diisi" },
        { status: 400 }
      );
    }

    if (type < 1 || type > 5) {
      return NextResponse.json(
        { error: "Field type harus bernilai antara 1 sampai 5" },
        { status: 400 }
      );
    }

    // pastikan student ada
    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return NextResponse.json(
        { error: "Siswa tidak ditemukan" },
        { status: 404 }
      );
    }

    const presence = await prisma.studentPresence.create({
      data: {
        studentId,
        picId: user.id,
        presenceAt: new Date(presenceAt),
        dayOfWeek: dayOfWeek ?? null,
        type,
      },
    });

    return NextResponse.json({
      message: "Kehadiran berhasil ditambahkan",
      presence,
    });
  } catch (error) {
    console.error("Create presence error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat kehadiran" },
      { status: 500 }
    );
  }
}

// PUT - Update kehadiran (hanya OWNER)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error, user } = await requireAuth(request, ["OWNER"]);
    if (error) return error;

    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        { error: "Request body tidak boleh kosong" },
        { status: 400 }
      );
    }

    const body = JSON.parse(text);
    const { presenceAt, dayOfWeek, type } = body;

    // validasi type
    if (type !== undefined && (type < 1 || type > 5)) {
      return NextResponse.json(
        { error: "Field type harus bernilai antara 1 sampai 5" },
        { status: 400 }
      );
    }

    const existing = await prisma.studentPresence.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data kehadiran tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.studentPresence.update({
      where: { id: params.id },
      data: {
        presenceAt: presenceAt ? new Date(presenceAt) : existing.presenceAt,
        dayOfWeek: dayOfWeek ?? existing.dayOfWeek,
        type: type ?? existing.type,
      },
    });

    return NextResponse.json({
      message: "Data kehadiran berhasil diperbarui",
      presence: updated,
    });
  } catch (error) {
    console.error("Update presence error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui kehadiran" },
      { status: 500 }
    );
  }
}
