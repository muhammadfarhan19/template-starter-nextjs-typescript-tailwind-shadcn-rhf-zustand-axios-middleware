"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { PresenceStatus, Student, PresenceRecord } from "@/types/presence.type";
import { cn } from "@/lib/utils";

interface StudentPresenceTableProps {
  selectedDate: Date;
}

// Mock data - ganti dengan data dari API
const mockStudents: Student[] = Array.from({ length: 50 }, (_, i) => ({
  id: `STD${String(i + 1).padStart(3, "0")}`,
  name: `Santri ${i + 1}`,
  grade: `Kelas ${Math.floor(i / 10) + 1}`,
}));

export default function StudentPresenceTable({
  selectedDate,
}: StudentPresenceTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState<string>("all");
  const [presenceData, setPresenceData] = useState<
    Record<string, PresenceStatus>
  >(() => {
    // Initialize with mock data - replace with API call
    const initial: Record<string, PresenceStatus> = {};
    mockStudents.forEach((student) => {
      initial[student.id] = "Hadir";
    });
    return initial;
  });

  // Get unique classes
  const classes = useMemo(() => {
    const uniqueClasses = new Set(mockStudents.map((s) => s.grade));
    return Array.from(uniqueClasses).sort();
  }, []);

  // Filter students
  const filteredStudents = useMemo(() => {
    return mockStudents.filter((student) => {
      const matchesSearch = student.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesClass =
        filterClass === "all" || student.grade === filterClass;
      return matchesSearch && matchesClass;
    });
  }, [searchQuery, filterClass]);

  // Handle status change
  const handleStatusChange = (studentId: string, status: PresenceStatus) => {
    setPresenceData((prev) => ({
      ...prev,
      [studentId]: status,
    }));
    // TODO: Call API to save the status
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const values = Object.values(presenceData);
    return {
      present: values.filter((s) => s === "Hadir").length,
      late: values.filter((s) => s === "Terlambat").length,
      sick: values.filter((s) => s === "Sakit").length,
      absent: values.filter((s) => s === "Izin").length,
      excused: values.filter((s) => s === "Alpa").length,
    };
  }, [presenceData]);

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log(
      "Exporting data for",
      format(selectedDate, "PPP", { locale: id })
    );
  };

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard label="Hadir" value={stats.present} color="bg-green-500" />
        <StatCard label="Terlambat" value={stats.late} color="bg-yellow-500" />
        <StatCard label="Sakit" value={stats.sick} color="bg-blue-500" />
        <StatCard label="Izin" value={stats.excused} color="bg-purple-500" />
        <StatCard label="Alpa" value={stats.absent} color="bg-red-500" />
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari nama santri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              {classes.map((cls) => (
                <SelectItem key={cls} value={cls}>
                  {cls}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">No</TableHead>
              <TableHead>ID Santri</TableHead>
              <TableHead>Nama Santri</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead className="w-[200px]">Status Kehadiran</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  Tidak ada data santri
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student, index) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    <PresenceStatusSelect
                      value={presenceData[student.id]}
                      onChange={(status) =>
                        handleStatusChange(student.id, status)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

// Sub-components
interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("h-12 w-12 rounded-lg", color, "opacity-10")} />
      </div>
    </Card>
  );
}

interface PresenceStatusSelectProps {
  value: PresenceStatus;
  onChange: (status: PresenceStatus) => void;
}

function PresenceStatusSelect({ value, onChange }: PresenceStatusSelectProps) {
  const statusConfig: Record<
    PresenceStatus,
    { label: PresenceStatus; color: string }
  > = {
    Hadir: { label: "Hadir", color: "text-green-600" },
    Terlambat: { label: "Terlambat", color: "text-yellow-600" },
    Sakit: { label: "Sakit", color: "text-blue-600" },
    Alpa: { label: "Izin", color: "text-purple-600" },
    Izin: { label: "Alpa", color: "text-red-600" },
  };

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as PresenceStatus)}
    >
      <SelectTrigger className={cn("w-full", statusConfig[value].color)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([status, config]) => (
          <SelectItem key={status} value={status} className={config.color}>
            {config.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
