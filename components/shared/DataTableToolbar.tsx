"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

interface FilterOption {
  key: string;
  label: string;
  options: string[];
}

interface DataTableToolbarProps {
  filters: FilterOption[];
}

export function DataTableToolbar({ filters }: DataTableToolbarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Ambil nilai langsung dari searchParams sebagai source of truth
  const urlSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(urlSearch);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmedSearch = search.trim();

      // Hanya update jika berbeda dengan URL saat ini
      if (trimmedSearch !== urlSearch) {
        params.delete("page");

        if (trimmedSearch) {
          params.set("q", trimmedSearch);
        } else {
          params.delete("q");
        }

        startTransition(() => {
          router.replace(`${window.location.pathname}?${params.toString()}`, {
            scroll: false,
          });
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, searchParams, router, urlSearch]);

  // Handle filter change
  const handleSelectChange = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (val === "all") {
      params.delete(key);
    } else {
      params.set(key, val);
    }

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  // Reset semua filter & search
  const handleReset = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("q");
    filters.forEach((f) => params.delete(f.key));

    setSearch(""); // Clear input field

    startTransition(() => {
      router.replace(`${window.location.pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <div className="flex flex-wrap gap-3 items-center justify-between p-4 border rounded-md bg-white">
      {/* Search Input */}
      <div className="relative w-[250px]">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="size-4" />
        </div>
        <Input
          type="text"
          placeholder="Cari nama, wali, atau nomor telepon..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          disabled={isPending}
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        {filters.map((filter) => {
          const currentValue = searchParams.get(filter.key) || "all";
          return (
            <Select
              key={filter.key}
              value={currentValue}
              onValueChange={(val) => handleSelectChange(filter.key, val)}
              disabled={isPending}
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
          );
        })}

        <Button variant="outline" onClick={handleReset} disabled={isPending}>
          Reset Filter
        </Button>
      </div>
    </div>
  );
}
