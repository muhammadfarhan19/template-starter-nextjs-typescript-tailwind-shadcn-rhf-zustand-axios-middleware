"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useTableFilterStore } from "@/stores/useTableFilterStore";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: {
    key: string; // misal "region" | "status"
    label: string;
    options: string[];
  }[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  searchPlaceholder?: string;
}

export function CustomTable<T>({
  data,
  columns,
  filters = [],
  enableSorting = false,
  enablePagination = false,
}: CustomTableProps<T>) {
  const {
    search,
    filters: globalFilters,
    resetFilters,
  } = useTableFilterStore();
  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = search
        ? Object.values(item as any)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      const matchFilters = Object.entries(globalFilters).every(([key, value]) =>
        value ? String((item as any)[key]) === value : true
      );

      return matchSearch && matchFilters;
    });
  }, [data, search, globalFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
  });

  return (
    <div className="space-y-4">
      {/* 🧱 Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      enableSorting
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className="p-4 font-medium text-foreground cursor-pointer select-none"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {enableSorting && (
                      <span>
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t hover:bg-muted/40 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📑 Pagination */}
      {enablePagination && (
        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <span className="text-sm">
            Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
