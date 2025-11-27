// lib/validators/student.validator.ts
import { Gender, EnrollmentStatus } from "@prisma/client";
import { z } from "zod";

/**
 * Student Registration Schema
 */
export const createStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),
  gender: z.nativeEnum(Gender, {
    error: () => ({ message: "Jenis kelamin harus MALE atau FEMALE" }),
  }),
  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(500, "Alamat maksimal 500 karakter")
    .trim(),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-() ]+$/, "Format nomor telepon tidak valid")
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .trim()
    .optional()
    .nullable(),
  fatherName: z
    .string()
    .max(100, "Nama ayah maksimal 100 karakter")
    .trim()
    .optional()
    .nullable(),
  motherName: z
    .string()
    .max(100, "Nama ibu maksimal 100 karakter")
    .trim()
    .optional()
    .nullable(),
  grade: z
    .string()
    .max(50, "Kelas maksimal 50 karakter")
    .trim()
    .optional()
    .nullable(),
  status: z.nativeEnum(EnrollmentStatus).optional(),
});

/**
 * Student Update Schema (all fields optional)
 */
export const updateStudentSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim()
    .optional(),
  gender: z
    .nativeEnum(Gender, {
      error: () => ({ message: "Jenis kelamin harus MALE atau FEMALE" }),
    })
    .optional(),
  address: z
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(500, "Alamat maksimal 500 karakter")
    .trim()
    .optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9+\-() ]+$/, "Format nomor telepon tidak valid")
    .min(8, "Nomor telepon minimal 8 digit")
    .max(20, "Nomor telepon maksimal 20 karakter")
    .trim()
    .nullable()
    .optional(),
  fatherName: z
    .string()
    .max(100, "Nama ayah maksimal 100 karakter")
    .trim()
    .nullable()
    .optional(),
  motherName: z
    .string()
    .max(100, "Nama ibu maksimal 100 karakter")
    .trim()
    .nullable()
    .optional(),
  grade: z
    .string()
    .max(50, "Kelas maksimal 50 karakter")
    .trim()
    .nullable()
    .optional(),
  status: z.nativeEnum(EnrollmentStatus).optional(),
});

/**
 * Query Params Schema for filtering students
 */
export const studentQuerySchema = z.object({
  status: z.nativeEnum(EnrollmentStatus).nullable().optional(),
  grade: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(15),
});

// Type exports
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryParams = z.infer<typeof studentQuerySchema>;

/**
 * Validate student data
 */
export function validateCreateStudent(data: unknown) {
  return createStudentSchema.safeParse(data);
}

export function validateUpdateStudent(data: unknown) {
  return updateStudentSchema.safeParse(data);
}

export function validateStudentQuery(params: unknown) {
  return studentQuerySchema.safeParse(params);
}
