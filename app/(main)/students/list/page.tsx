"use client";

import MainContainer from "@/components/layouts/MainContainer";
import { CustomTable } from "@/components/shared/CustomTable";
import {
  filterOptions,
  studentColumns,
} from "./_components/students-list-data";
import { useStudentList } from "@/hooks/useStudentList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { DataTableToolbar } from "@/components/shared/DataTableToolbar";

export default function Page() {
  const router = useRouter();

  const { data } = useStudentList();
  const dataTable = data?.data || [];

  return (
    <MainContainer>
      {/* Header */}
      <div className="col-span-12 flex items-center justify-between">
        <h1 className="font-semibold text-2xl">Daftar Santri</h1>
        <Button
          variant={"default"}
          onClick={() => router.push("/students/formulir")}
        >
          <Plus /> Tambah
        </Button>
      </div>

      <div className="col-span-12 space-y-1.5">
        <DataTableToolbar filters={filterOptions} />
      </div>

      {/* table */}
      <div className="col-span-12 space-y-1.5">
        <CustomTable
          columns={studentColumns}
          data={dataTable}
          enablePagination
          enableSorting
        />
      </div>
    </MainContainer>
  );
}
