"use client";

import { CustomTable } from "@/components/shared/CustomTable";
import { Vehicle, vehicleColumns } from "./_components/data-column";
import { DataTableToolbar } from "@/components/shared/DataTableToolbar";
import MainContainer from "@/components/layouts/MainContainer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Download,
  Plus,
  Settings,
  Truck,
  Upload,
} from "lucide-react";

interface DataCard {
  id: string;
  label: string;
  total: number;
  variant: string;
  icon: React.ElementType;
}

const data: Vehicle[] = [
  {
    id: "1",
    kontrak: "KTR-001-2024 FID: FID-2024-001",
    police_number: "R 1234 AB",
    type: "Toyota Hilux 2.4",
    leasing: "PT Adira Finance",
    regional: "Jakarta",
    status: "Lengkap",
  },
  {
    id: "2",
    kontrak: "KTR-001-2024 FID: FID-2024-001",
    police_number: "R 1234 AB",
    type: "Toyota Hilux 2.4",
    leasing: "PT Adira Finance",
    regional: "Surabaya",
    status: "Dalam Proses",
  },
  {
    id: "3",
    kontrak: "KTR-001-2024 FID: FID-2024-001",
    police_number: "R 1234 AB",
    type: "Toyota Hilux 2.4",
    leasing: "PT Adira Finance",
    regional: "Balikpapan",
    status: "Lengkap",
  },
];

const filterOptions = [
  {
    key: "regional",
    label: "Regional",
    options: ["Jakarta", "Surabaya", "Balikpapan"],
  },
  { key: "status", label: "Status", options: ["Lengkap", "Dalam Proses"] },
];

const dataCards: DataCard[] = [
  {
    id: "1",
    label: "Total Kendaraan",
    variant: "primary",
    total: 150,
    icon: Truck,
  },
  {
    id: "2",
    label: "BPKB Lengkap",
    variant: "green-500",
    total: 23,
    icon: Settings,
  },
  {
    id: "3",
    label: "Dalam Proses",
    variant: "yelow-500",
    total: 127,
    icon: Clock,
  },
  {
    id: "4",
    label: "Belum Ada",
    variant: "red-500",
    total: 127,
    icon: Calendar,
  },
];

export default function DemoTablePage() {
  return (
    <MainContainer>
      {/* header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Master Data Kendaraan KRP</h1>
          <p className="text-sm">
            Kelola data kendaraan KRP (Kredit Rental Pembiayaan)
          </p>
        </div>
        <div className="flex items-center gap-x-2.5">
          <Button variant={"default"}>
            <Upload /> Import Data
          </Button>
          <Button variant={"secondary"}>
            <Download /> Export Data
          </Button>
          <Button variant={"foreground"}>
            <Plus />
            Tambah Kendaraan
          </Button>
        </div>
      </div>

      {/* cards */}
      <div className="col-span-12 grid grid-cols-12 gap-3">
        {dataCards.map((item) => (
          <div
            className="rounded-md border p-4 flex items-center justify-between col-span-12 md:col-span-6 lg:col-span-3"
            key={item.id}
          >
            <div className="">
              <h2>{item.label}</h2>
              <h3 className={`text-xl font-semibold text-${item.variant}`}>
                {item.total}
              </h3>
            </div>
            <item.icon className={`text-${item.variant}`} />
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="col-span-12 space-y-1.5">
        <DataTableToolbar filters={filterOptions} />
      </div>

      {/* table */}
      <div className="col-span-12 space-y-1.5">
        <CustomTable
          columns={vehicleColumns}
          data={data}
          enablePagination
          enableSorting
        />
      </div>
    </MainContainer>
  );
}
