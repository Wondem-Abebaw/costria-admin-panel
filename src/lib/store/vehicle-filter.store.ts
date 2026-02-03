import { create } from "zustand";

interface VehicleFilterState {
  subCategory: string;
  status: string;
  city: string;

  setSubCategory: (v: string) => void;
  setStatus: (v: string) => void;
  setCity: (v: string) => void;
  resetFilters: () => void;
}

const useVehicleFilterStore = create<VehicleFilterState>((set) => ({
  subCategory: "",
  status: "",
  city: "",

  setSubCategory: (v) => set({ subCategory: v }),
  setStatus: (v) => set({ status: v }),
  setCity: (v) => set({ city: v }),
  resetFilters: () => set({ subCategory: "", status: "", city: "" }),
}));

export default useVehicleFilterStore;
