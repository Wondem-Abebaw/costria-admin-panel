// lib/store/users-filter.store.ts
import { create } from "zustand";

interface UsersFilterState {
  status: string;
  setStatus: (value: string) => void;
  resetFilters: () => void;
}

const useUsersFilterStore = create<UsersFilterState>((set) => ({
  status: "",
  setStatus: (value) => set({ status: value }),
  resetFilters: () => set({ status: "" }),
}));

export default useUsersFilterStore;