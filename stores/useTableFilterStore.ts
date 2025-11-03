// store/useTableStore.ts
import { create } from "zustand";

interface TableState {
  search: string;
  filters: Record<string, string>;
  page: number;
  setSearch: (value: string) => void;
  setFilter: (key: string, value: string) => void;
  resetFilters: () => void;
  setPage: (value: number) => void;
}

export const useTableFilterStore = create<TableState>((set) => ({
  search: "",
  filters: {},
  page: 1,
  setSearch: (value) => set({ search: value }),
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ search: "", filters: {}, page: 1 }),
  setPage: (value) => set({ page: value }),
}));
