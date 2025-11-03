"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableFilterStore } from "@/stores/useTableFilterStore";

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

interface DataTableToolbarProps {
  filters: FilterOption[];
}

export function DataTableToolbar({ filters }: DataTableToolbarProps) {
  const {
    search,
    setSearch,
    filters: stateFilters,
    setFilter,
    resetFilters,
  } = useTableFilterStore();

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between p-4 border rounded-md bg-white">
      <div className="relative w-[250px]">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4" />
        </div>
        <Input
          type="text"
          placeholder="Cari nomor polisi, merk, atau PIC..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-3">
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={stateFilters[filter.key] ?? "all"}
            onValueChange={(val) => setFilter(filter.key, val)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Semua ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua {filter.label}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        <Button variant="outline" onClick={resetFilters}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
