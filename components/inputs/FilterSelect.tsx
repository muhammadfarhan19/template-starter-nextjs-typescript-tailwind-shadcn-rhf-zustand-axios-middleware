"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTableFilterStore } from "@/stores/useTableFilterStore";

interface FilterSelectProps {
  filterKey: string; // e.g. "region", "status"
  label?: string;
  options: string[];
}

export function FilterSelect({ filterKey, label, options }: FilterSelectProps) {
  const { filters, setFilter } = useTableFilterStore();
  const current = filters[filterKey] || "";

  return (
    <Select value={current} onValueChange={(val) => setFilter(filterKey, val)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder={label || "Select"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="all" value="">
          Semua
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt} value={opt}>
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
