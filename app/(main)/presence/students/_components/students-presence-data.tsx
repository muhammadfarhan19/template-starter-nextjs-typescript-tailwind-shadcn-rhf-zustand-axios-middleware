import { Badge } from "@/components/ui/badge";
import { PRESENCE_OPTIONS } from "@/lib/filter-options";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Edit, Trash, User, IdCard } from "lucide-react";

export type PersonelData = {
  id: string;
  name: string;
  contact: string;
  position: string;
  sim: string;
  type: string;
  status: string;
};

export interface DataCard {
  id: string;
  label: string;
  total: number;
  variant: string;
  icon: React.ElementType;
}

export interface DataStatus {
  id: string;
  label: string;
  variant: string;
}

export const personelAmtColumn: ColumnDef<PersonelData>[] = [
  {
    accessorKey: "name",
    header: "Nama",
    // cell: ({ getValue }) => {
    //   const value = getValue() as string;
    //   const text = value.split(" | ");
    //   return (
    //     <div className="">
    //       <h2 className="font-semibold">{text[0]}</h2>
    //       <p className="text-xs">{text[1]}</p>
    //     </div>
    //   );
    // },
  },
  {
    accessorKey: "contact",
    header: "Kontak",
    // cell: ({ getValue }) => {
    //   const value = getValue() as string;
    //   const text = value.split(" | ");
    //   return (
    //     <div className="">
    //       <h2 className="">{text[0]}</h2>
    //       <p className="text-xs">{text[1]}</p>
    //     </div>
    //   );
    // },
  },
  { accessorKey: "position", header: "Posisi" },
  { accessorKey: "sim", header: "SIM" },
  { accessorKey: "type", header: "MCU / DCU / DDT" },
  {
    accessorKey: "status",
    header: "Status",
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

export const dataTable: PersonelData[] = [
  {
    id: "1",
    name: "John Doe",
    contact: "john.doe@gmail.com",
    position: "Driver",
    sim: "123",
    type: "MCU",
    status: "Lengkap",
  },
  {
    id: "2",
    name: "John Doe",
    contact: "john.doe@gmail.com",
    position: "Driver",
    sim: "123",
    type: "DCU",
    status: "Dalam Proses",
  },
  {
    id: "3",
    name: "John Doe",
    contact: "john.doe@gmail.com",
    position: "Driver",
    sim: "123",
    type: "DDT",
    status: "Lengkap",
  },
];

export const dataCards: DataCard[] = [
  {
    id: "1",
    label: "Total Personel",
    variant: "primary",
    total: 150,
    icon: User,
  },
  {
    id: "2",
    label: "Aktif",
    variant: "green-500",
    total: 23,
    icon: User,
  },
  {
    id: "3",
    label: "SIM Expired",
    variant: "red-500",
    total: 127,
    icon: IdCard,
  },
];

export const dataStatus: DataStatus[] = [
  {
    id: "1",
    label: "Lulus",
    variant: "green-100",
  },
  {
    id: "2",
    label: "Tidak Lulus",
    variant: "red-100",
  },
  {
    id: "3",
    label: "Dalam Proses",
    variant: "blue-300",
  },
  {
    id: "4",
    label: "Belum",
    variant: "yellow-100",
  },
];

export const filterOptions = [PRESENCE_OPTIONS];
