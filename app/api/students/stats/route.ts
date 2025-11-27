// api/students/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { ApiResponse } from "@/types/common";

interface StudentStats {
  total: number;
  byStatus: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
    CANCELLED: number;
  };
  byGender: {
    MALE: number;
    FEMALE: number;
  };
  byGrade: Record<string, number>;
  recentRegistrations: number;
  activeEnrollments: number;
  totalPresences: number;
}

/**
 * GET /api/students/stats
 * Get student statistics
 * Auth: Any authenticated user
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudentStats>>> {
  try {
    const { error, user } = await requireAuth(request);
    if (error) return error;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Execute all queries in parallel for better performance
    const [
      total,
      statusCounts,
      genderCounts,
      gradeCounts,
      recentRegistrations,
      activeEnrollments,
      totalPresences,
    ] = await Promise.all([
      // Total students
      prisma.student.count({
        where: { deletedAt: null },
      }),

      // Count by status
      prisma.student.groupBy({
        by: ["status"],
        where: { deletedAt: null },
        _count: true,
      }),

      // Count by gender
      prisma.student.groupBy({
        by: ["gender"],
        where: { deletedAt: null },
        _count: true,
      }),

      // Count by grade
      prisma.student.groupBy({
        by: ["grade"],
        where: {
          deletedAt: null,
          grade: { not: null },
        },
        _count: true,
      }),

      // Recent registrations (last 30 days)
      prisma.student.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),

      // Active enrollments
      prisma.enrollment.count({
        where: {
          status: {
            in: ["PENDING", "APPROVED"],
          },
          student: {
            deletedAt: null,
          },
        },
      }),

      // Total presences
      prisma.studentPresence.count({
        where: {
          deletedAt: null,
          student: {
            deletedAt: null,
          },
        },
      }),
    ]);

    // Format status counts
    const byStatus = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    statusCounts.forEach((item) => {
      byStatus[item.status as keyof typeof byStatus] = item._count;
    });

    // Format gender counts
    const byGender = {
      MALE: 0,
      FEMALE: 0,
    };
    genderCounts.forEach((item) => {
      byGender[item.gender as keyof typeof byGender] = item._count;
    });

    // Format grade counts
    const byGrade: Record<string, number> = {};
    gradeCounts.forEach((item) => {
      if (item.grade) {
        byGrade[item.grade] = item._count;
      }
    });

    const stats: StudentStats = {
      total,
      byStatus,
      byGender,
      byGrade,
      recentRegistrations,
      activeEnrollments,
      totalPresences,
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get student stats error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mengambil statistik siswa",
      },
      { status: 500 }
    );
  }
}
