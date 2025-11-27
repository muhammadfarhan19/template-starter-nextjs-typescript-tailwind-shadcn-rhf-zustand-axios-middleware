// api/students/bulk/route.ts
// ============================================

import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/students/bulk
 * Bulk update student status
 * Auth: OWNER, ACADEMIC only
 */
export async function POST(request: NextRequest) {
  try {
    const { error, user } = await requireAuth(request, ["OWNER", "ACADEMIC"]);
    if (error) return error;

    const body = await request.json();
    const { studentIds, status, action } = body;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "studentIds harus berupa array dan tidak boleh kosong",
        },
        { status: 400 }
      );
    }

    if (!action || !["update_status", "delete"].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: "action harus berupa 'update_status' atau 'delete'",
        },
        { status: 400 }
      );
    }

    let result;

    if (action === "update_status") {
      if (
        !status ||
        !["PENDING", "APPROVED", "REJECTED", "CANCELLED"].includes(status)
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "status tidak valid",
            validValues: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
          },
          { status: 400 }
        );
      }

      result = await prisma.student.updateMany({
        where: {
          id: { in: studentIds },
          deletedAt: null,
        },
        data: {
          status,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `${result.count} siswa berhasil diperbarui`,
        data: {
          count: result.count,
          status,
        },
      });
    }

    if (action === "delete") {
      // Only OWNER can bulk delete
      if (user?.role !== "OWNER") {
        return NextResponse.json(
          {
            success: false,
            error: "Hanya OWNER yang dapat menghapus siswa secara massal",
          },
          { status: 403 }
        );
      }

      // Check for active enrollments
      const activeEnrollments = await prisma.enrollment.count({
        where: {
          studentId: { in: studentIds },
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
      });

      if (activeEnrollments > 0) {
        return NextResponse.json(
          {
            success: false,
            error: `${activeEnrollments} siswa masih memiliki pendaftaran aktif`,
          },
          { status: 400 }
        );
      }

      result = await prisma.student.updateMany({
        where: {
          id: { in: studentIds },
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `${result.count} siswa berhasil dihapus`,
        data: {
          count: result.count,
        },
      });
    }
  } catch (error) {
    console.error("Bulk operation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat melakukan operasi massal",
      },
      { status: 500 }
    );
  }
}
