// lib/api/categories.ts
import { apiClient } from "./client";

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: {
    id: string;
    name: string;
    categoryId: string;
  }[];
}

export interface VehicleFilters {
  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  bodyTypes: string[];
  conditions: string[];
  features: string[];
}
export interface EquipmentFilters {
  brands: string[];
  conditions: string[];
  features: string[];
}

export const categoriesApi = {
  getAll: async (): Promise<{ categories: Category[] }> => {
    const { data } = await apiClient.get("/categories");
    return data;
  },

  getVehicleFilters: async (): Promise<VehicleFilters> => {
    const { data } = await apiClient.get<VehicleFilters>(
      "/categories/vehicle-filters"
    );
    return data;
  },
  getEquipmentFilters: async (): Promise<EquipmentFilters> => {
    // const { data } = await apiClient.get<EquipmentFilters>(
    //   "/categories/construction-filters"
    // );
    return {
      brands: [
        "Caterpillar",
        "Komatsu",
        "Volvo",
        "Hitachi",
        "JCB",
        "Liebherr",
        "Doosan",
        "Hyundai",
        "SANY",
        "XCMG",
        "Bobcat",
        "Case",
        "John Deere",
        "Terex",
        "Manitou",
        "Atlas Copco",
        "Hilti",
        "Makita",
        "Bosch",
        "DeWalt",
      ],
      conditions: ["New", "Used", "Reconditioned"],
      features: [
        "GPS Tracking",
        "Operator Included",
        "Fuel Included",
        "Insurance Included",
        "Maintenance Included",
        "Delivery Available",
        "24/7 Support",
        "Training Provided",
        "Safety Equipment",
        "Remote Monitoring",
      ],
    };
  },

  getPropertyFilters: async (): Promise<any> => {
    const { data } = await apiClient.get("/categories/property-filters");
    return data;
  },
};
