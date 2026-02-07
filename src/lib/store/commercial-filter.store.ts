// lib/store/commercial-filter.store.ts
import { create } from "zustand";

interface CommercialFilterState {
  subCategory: string;
  status: string;
  city: string;
  setSubCategory: (value: string) => void;
  setStatus: (value: string) => void;
  setCity: (value: string) => void;
  resetFilters: () => void;
}

const useCommercialFilterStore = create<CommercialFilterState>((set) => ({
  subCategory: "",
  status: "",
  city: "",
  setSubCategory: (value) => set({ subCategory: value }),
  setStatus: (value) => set({ status: value }),
  setCity: (value) => set({ city: value }),
  resetFilters: () => set({ subCategory: "", status: "", city: "" }),
}));

export default useCommercialFilterStore;