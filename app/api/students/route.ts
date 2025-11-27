// api/students/route.ts 
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import {
  validateCreateStudent,
  validateStudentQuery,
} from "@/lib/validators/student.validator";
import { ApiResponse } from "@/types/common";
import { StudentListItem } from "@/types/student.type";

/**
 * GET /api/students
 * List all students with pagination and filters
 * Auth: Any authenticated user
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudentListItem[]>>> {
  try {
    const { error } = await requireAuth(request);
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const queryValidation = validateStudentQuery({
      status: searchParams.get("status") || undefined,
      grade: searchParams.get("grade") || undefined,
      search: searchParams.get("search") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Parameter query tidak valid",
          fields: queryValidation.error.flatten().fieldErrors as any,
        },
        { status: 400 }
      );
    }

    const { status, grade, search } = queryValidation.data;
    let { page, limit } = queryValidation.data;

    // default pagination
    page = page || 1;
    limit = limit || 15;

    // filter dinamis
    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (grade) where.grade = grade;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { fatherName: { contains: search, mode: "insensitive" } },
        { motherName: { contains: search, mode: "insensitive" } },
      ];
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
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
          _count: {
            select: { enrollments: true, presences: true },
          },
        },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: students,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Get students error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengambil data siswa" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/students
 * Create new student registration
 * Auth: OWNER, ACADEMIC only
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<StudentListItem>>> {
  try {
    const { error } = await requireAuth(request, ["OWNER", "ACADEMIC"]);
    if (error) return error;

    // Parse request body
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

    // Validate using Zod schema
    const validation = validateCreateStudent(body);

    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Data tidak valid",
          fields: Object.entries(fieldErrors).reduce((acc, [key, value]) => {
            acc[key] = value?.[0] || "Invalid field";
            return acc;
          }, {} as Record<string, string>),
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // Check for duplicate phone number
    if (validatedData.phoneNumber) {
      const existingStudent = await prisma.student.findFirst({
        where: {
          phoneNumber: validatedData.phoneNumber,
          deletedAt: null,
        },
      });

      if (existingStudent) {
        return NextResponse.json(
          {
            success: false,
            error: "Nomor telepon sudah terdaftar",
            fields: {
              phoneNumber: `Nomor ini sudah digunakan oleh ${existingStudent.name}`,
            },
          },
          { status: 409 }
        );
      }
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        ...validatedData,
        status: validatedData.status || "PENDING",
      },
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
        _count: {
          select: {
            enrollments: true,
            presences: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran siswa berhasil dibuat",
        data: student,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create student error:", error);

    // Handle Prisma unique constraint violation
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0] || "unknown";
      return NextResponse.json(
        {
          success: false,
          error: `Data ${field} sudah digunakan`,
          fields: {
            [field]: "Data ini sudah terdaftar",
          },
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan saat mendaftarkan siswa",
      },
      { status: 500 }
    );
  }
}
