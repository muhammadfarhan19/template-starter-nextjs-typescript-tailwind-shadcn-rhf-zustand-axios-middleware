import { create } from "zustand";

// ====================
// 🔹 Base Store
// ====================
interface TableState {
  tableStates: Record<
    string,
    {
      search: string;
      filters: Record<string, string>;
      page: number;
    }
  >;
  setSearch: (storeKey: string, value: string) => void;
  setFilter: (storeKey: string, key: string, value: string) => void;
  resetFilters: (storeKey: string) => void;
  setPage: (storeKey: string, value: number) => void;
}

export const useTableFilterStore = create<TableState>((set) => ({
  tableStates: {},
  setSearch: (storeKey, value) =>
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [storeKey]: {
          ...(state.tableStates[storeKey] || {
            search: "",
            filters: {},
            page: 1,
          }),
          search: value,
        },
      },
    })),
  setFilter: (storeKey, key, value) =>
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [storeKey]: {
          ...(state.tableStates[storeKey] || {
            search: "",
            filters: {},
            page: 1,
          }),
          filters: {
            ...(state.tableStates[storeKey]?.filters || {}),
            [key]: value,
          },
        },
      },
    })),
  resetFilters: (storeKey) =>
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [storeKey]: { search: "", filters: {}, page: 1 },
      },
    })),
  setPage: (storeKey, value) =>
    set((state) => ({
      tableStates: {
        ...state.tableStates,
        [storeKey]: {
          ...(state.tableStates[storeKey] || {
            search: "",
            filters: {},
            page: 1,
          }),
          page: value,
        },
      },
    })),
}));
