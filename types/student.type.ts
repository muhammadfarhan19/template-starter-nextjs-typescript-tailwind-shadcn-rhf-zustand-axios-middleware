// lib/types/student.types.ts
// ============================================

import { Prisma } from "@prisma/client";

export type RegistrationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface StudentType {
  id: string;
  name: string;
  gender: string;
  address: string;
  phoneNumber: string;
  fatherName: string;
  motherName: string;
  grade: string;
  status: RegistrationStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt?: any;
  enrollments?: any[];
  invoices?: any[];
  presences?: any[];
  _count: Count;
}

export interface Count {
  enrollments: number;
  invoices: number;
  presences: number;
  payments: number;
}

/**
 * Student with relations type
 */
export type StudentWithRelations = Prisma.StudentGetPayload<{
  include: {
    enrollments: {
      include: {
        class: true;
      };
    };
    invoices: true;
    presences: true;
    _count: {
      select: {
        enrollments: true;
        invoices: true;
        presences: true;
        payments: true;
      };
    };
  };
}>;

/**
 * Student list item type
 */
export type StudentListItem = Prisma.StudentGetPayload<{
  select: {
    id: true;
    name: true;
    gender: true;
    address: true;
    phoneNumber: true;
    fatherName: true;
    motherName: true;
    grade: true;
    status: true;
    createdAt: true;
    updatedAt: true;
    _count: {
      select: {
        enrollments: true;
        presences: true;
      };
    };
  };
}>;

/**
 * Student Statistics
 */
export interface StudentStats {
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
  recentRegistrations: number; // last 30 days
}
