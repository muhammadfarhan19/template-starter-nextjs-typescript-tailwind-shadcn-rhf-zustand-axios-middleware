"use client";

import { Input } from "@/components/ui/input";
import { useTableFilterStore } from "@/stores/useTableFilterStore";
import { Search } from "lucide-react";

export function SearchInput({ placeholder }: { placeholder: string }) {
  const { search, setSearch } = useTableFilterStore();

  return (
    <div className="relative w-full">
      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
        <Search className="size-4" />
        <span className="sr-only">Search</span>
      </div>
      <Input
        id="search-header"
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="peer pl-9"
      />
    </div>
  );
}
