import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useFilterData = () => {
  const searchParams = useSearchParams();

  // Ambil search query
  const search = searchParams.get("q") || "";

  // Ambil semua filters dari URL (selain 'q' dan 'page')
  const filters = useMemo(() => {
    const filterObj: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      // Exclude query dan page dari filters
      if (key !== "q" && key !== "page") {
        filterObj[key] = value;
      }
    });

    return filterObj;
  }, [searchParams]);

  // Ambil page number
  const page = parseInt(searchParams.get("page") || "1", 10);

  return {
    search,
    filters,
    page,
  };
};
