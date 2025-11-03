import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash } from "lucide-react";

export type Vehicle = {
  id: string;
  kontrak: string;
  police_number: string;
  type: string;
  leasing: string;
  regional: string;
  status: string;
};

export const vehicleColumns: ColumnDef<Vehicle>[] = [
  { accessorKey: "kontrak", header: "Kontrak" },
  { accessorKey: "police_number", header: "Nopol" },
  { accessorKey: "type", header: "Merk/Type" },
  { accessorKey: "regional", header: "Regional" },
  { accessorKey: "leasing", header: "Leasing" },
  {
    accessorKey: "status",
    header: "Status BPKB",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      const variant = status === "Lengkap" ? "secondary" : "warning";
      return <Badge variant={variant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: () => (
      <div className="flex gap-x-3 text-gray-600">
        <Eye className="size-4 cursor-pointer" />
        <Edit className="size-4 cursor-pointer" />
        <Trash className="size-4 text-red-500 cursor-pointer" />
      </div>
    ),
  },
];
