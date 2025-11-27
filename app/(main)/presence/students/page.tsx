"use client";

import DatePickerWithPresets from "@/components/inputs/DatePIckerWithPresets";
import MainContainer from "@/components/layouts/MainContainer";
import { useState } from "react";
import { DataTableToolbar } from "@/components/shared/DataTableToolbar";
import {
  dataTable,
  filterOptions,
  personelAmtColumn,
} from "./_components/students-presence-data";
import { CustomTable } from "@/components/shared/CustomTable";

export default function Page() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <MainContainer>
      {/* Header */}
      <div className="col-span-12 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl">Kehadiran Santri</h1>
          <p className="text-sm text-gray-600">Atur kehadiran santri</p>
        </div>
        <DatePickerWithPresets
          date={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* filters */}
      <div className="col-span-12 space-y-1.5">
        <DataTableToolbar filters={filterOptions} />
      </div>

      {/* table */}
      <div className="col-span-12 space-y-1.5">
        <CustomTable
          columns={personelAmtColumn}
          data={dataTable}
          enablePagination
          enableSorting
        />
      </div>
    </MainContainer>
  );
}
