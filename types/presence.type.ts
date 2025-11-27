// types/presence.ts

export type PresenceStatus = 
  | "Hadir"   // Hadir
  | "Terlambat"      // Terlambat
  | "Sakit"      // Sakit
  | "Izin"   // Izin
  | "Alpa";   // Alpa

export interface Student {
  id: string;
  name: string;
  grade: string;
}

export interface PresenceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: PresenceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresenceStats {
  present: number;
  late: number;
  sick: number;
  excused: number;
  absent: number;
  total: number;
  percentage: number;
}