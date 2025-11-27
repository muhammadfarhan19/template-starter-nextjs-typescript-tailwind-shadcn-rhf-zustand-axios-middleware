// api/students/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { Gender, EnrollmentStatus } from "@prisma/client";

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/students/[id]
 * Get student detail by ID
 * Auth: Any authenticated user
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { id } = await params;

    const student = await prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        enrollments: {
          include: {
            class: {
              select: {
                id: true,
                name: true,
                grade: true,
                teacher: {
                  select: {
                    id: true,
                    user: {
                      select: {
                        fullName: true,
                        username: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        invoices: {
          where: {
            status: {
              in: ["PENDING", "PAID"],
            },
          },
          orderBy: {
            dueDate: "desc",
          },
          take: 5,
          select: {
            id: true,
            amount: true,
            dueDate: true,
            status: true,
            paidAt: true,
          },
        },
        presences: {
          orderBy: {
            presenceAt: "desc",
          },
          take: 10,
          select: {
            id: true,
            presenceAt: true,
            type: true,
            status: true,
            note: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
            invoices: true,
            presences: true,
            payments: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          error: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get student detail error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil detail siswa",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/students/[id]
 * Update student data
 * Auth: OWNER, ACADEMIC only
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { error, user } = await requireAuth(request, ["OWNER", "ACADEMIC"]);
    if (error) return error;

    const { id } = await params;

    // Check if student exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const text = await request.text();
    if (!text) {
      return NextResponse.json(
        {
          success: false,
          error: "Request body tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    const body = JSON.parse(text);
    const {
      name,
      gender,
      address,
      phoneNumber,
      fatherName,
      motherName,
      grade,
      status,
    } = body;

    // Validate gender if provided
    if (gender && !Object.values(Gender).includes(gender)) {
      return NextResponse.json(
        {
          success: false,
          error: "Jenis kelamin tidak valid",
          validValues: Object.values(Gender),
        },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !Object.values(EnrollmentStatus).includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Status pendaftaran tidak valid",
          validValues: Object.values(EnrollmentStatus),
        },
        { status: 400 }
      );
    }

    // Normalize phone numbers untuk perbandingan
    const normalizePhone = (phone: string) => phone?.trim().replace(/\s+/g, "");

    // Update bagian validasi phone number
    if (phoneNumber) {
      const normalizedNewPhone = normalizePhone(phoneNumber);
      const normalizedExistingPhone = normalizePhone(
        existingStudent.phoneNumber || ""
      );

      // Cek duplicate hanya jika nomor benar-benar berbeda
      if (normalizedNewPhone !== normalizedExistingPhone) {
        const duplicate = await prisma.student.findFirst({
          where: {
            phoneNumber: normalizedNewPhone,
            deletedAt: null,
            id: {
              not: id, // Gunakan format ini
            },
          },
        });

        if (duplicate) {
          return NextResponse.json(
            {
              success: false,
              error: "Nomor telepon sudah digunakan oleh siswa lain",
              debug: {
                // Untuk debugging
                sent: normalizedNewPhone,
                existing: normalizedExistingPhone,
                duplicateId: duplicate.id,
              },
            },
            { status: 409 }
          );
        }
      }
    }

    // Build update data object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address.trim();
    if (phoneNumber !== undefined)
      updateData.phoneNumber = phoneNumber?.trim() || null;
    if (fatherName !== undefined)
      updateData.fatherName = fatherName?.trim() || null;
    if (motherName !== undefined)
      updateData.motherName = motherName?.trim() || null;
    if (grade !== undefined) updateData.grade = grade?.trim() || null;
    if (status !== undefined) updateData.status = status;

    const updatedStudent = await prisma.student.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        gender: true,
        address: true,
        phoneNumber: true,
        fatherName: true,
        motherName: true,
        grade: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Data siswa berhasil diperbarui",
      data: updatedStudent,
    });
  } catch (error: any) {
    console.error("Update student error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,
          error: "Data siswa sudah ada (duplikat)",
          field: error.meta?.target,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat memperbarui data siswa",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/students/[id]
 * Soft delete student
 * Auth: OWNER only
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { error, user } = await requireAuth(request, ["OWNER"]);
    if (error) return error;

    const { id } = params;

    // Check if student exists
    const existingStudent = await prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        _count: {
          select: {
            enrollments: true,
            invoices: true,
            presences: true,
          },
        },
      },
    });

    if (!existingStudent) {
      return NextResponse.json(
        {
          success: false,
          error: "Siswa tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Check if student has active enrollments
    const activeEnrollments = await prisma.enrollment.count({
      where: {
        studentId: id,
        status: {
          in: ["PENDING", "APPROVED"],
        },
      },
    });

    if (activeEnrollments > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Tidak dapat menghapus siswa yang masih memiliki pendaftaran aktif",
          activeEnrollments,
        },
        { status: 400 }
      );
    }

    // Soft delete
    await prisma.student.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Siswa berhasil dihapus",
    });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat menghapus siswa",
      },
      { status: 500 }
    );
  }
}
