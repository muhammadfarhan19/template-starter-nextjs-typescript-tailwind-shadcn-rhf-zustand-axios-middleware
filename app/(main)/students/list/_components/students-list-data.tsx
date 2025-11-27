"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { RegistrationStatus, StudentListItem } from "@/types/student.type";
import { Eye, Edit, Trash } from "lucide-react";
import { REGISTRATION_STATUS_OPTIONS } from "@/lib/filter-options";
import { useRouter } from "next/navigation";

function ActionCell({ student }: { student: StudentListItem }) {
  const router = useRouter();

  return (
    <div className="flex gap-x-3 text-gray-600">
      <Eye
        className="size-4 cursor-pointer"
        onClick={() => router.push(`/students/${student.id}`)}
      />
      <Edit
        className="size-4 cursor-pointer"
        onClick={() => router.push(`/students/formulir?id=${student.id}`)}
      />
      <Trash className="size-4 text-red-500 cursor-pointer" />
    </div>
  );
}

export const studentColumns: ColumnDef<StudentListItem>[] = [
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "phoneNumber",
    header: "Nomor HP",
  },
  {
    accessorKey: "grade",
    header: "Kelas",
  },
  {
    accessorKey: "gender",
    header: "Jenis Kelamin",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as RegistrationStatus;

      const variant =
        status === "APPROVED"
          ? "default"
          : status === "PENDING"
          ? "warning"
          : "destructive";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => <ActionCell student={row.original} />,
  },
];

export const filterOptions = [REGISTRATION_STATUS_OPTIONS];
