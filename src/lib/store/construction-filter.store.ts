// lib/store/construction-equipment-filter.store.ts
import { create } from "zustand";

interface ConstructionEquipmentFilterState {
  subCategory: string;
  status: string;
  city: string;
  setSubCategory: (value: string) => void;
  setStatus: (value: string) => void;
  setCity: (value: string) => void;
  resetFilters: () => void;
}

const useConstructionEquipmentFilterStore = create<ConstructionEquipmentFilterState>((set) => ({
  subCategory: "",
  status: "",
  city: "",
  setSubCategory: (value) => set({ subCategory: value }),
  setStatus: (value) => set({ status: value }),
  setCity: (value) => set({ city: value }),
  resetFilters: () => set({ subCategory: "", status: "", city: "" }),
}));

export default useConstructionEquipmentFilterStore;