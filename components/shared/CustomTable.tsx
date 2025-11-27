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
import { useState, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useFilterData } from "@/hooks/useFilterData";

interface CustomTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
}

export function CustomTable<T>({
  data,
  columns,
  enableSorting = false,
  enablePagination = false,
  pageSize = 10,
}: CustomTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { search, filters: globalFilters, page } = useFilterData();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isPending, startTransition] = useTransition();

  // Filter data berdasarkan search dan filters dari URL
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Filter berdasarkan search query
      const matchSearch = search
        ? Object.values(item as any)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
        : true;

      // Filter berdasarkan select filters
      const matchFilters = Object.entries(globalFilters).every(([key, value]) =>
        value ? String((item as any)[key]) === value : true
      );

      return matchSearch && matchFilters;
    });
  }, [data, search, globalFilters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1, // Convert 1-based to 0-based
        pageSize,
      },
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enablePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pageSize),
  });

  // Update URL saat ganti halaman
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete("page"); // Default page 1, hapus dari URL
    } else {
      params.set("page", newPage.toString());
    }

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  return (
    <div className="space-y-4">
      {/* Info hasil filter */}
      {(search || Object.keys(globalFilters).length > 0) && (
        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredData.length} dari {data.length} data
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      enableSorting && !isPending
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={`p-4 font-medium text-foreground ${
                      enableSorting ? "cursor-pointer select-none" : ""
                    }`}
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  {isPending ? "Loading..." : "Tidak ada data ditemukan"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t hover:bg-muted/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {enablePagination && filteredData.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, filteredData.length)} dari{" "}
            {filteredData.length} data
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isPending}
            >
              Prev
            </Button>
            <span className="text-sm">
              Halaman {currentPage} dari {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
