// lib/store/vehicle-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VehicleFormState {
  // Top-level fields (extracted from attributes)
  title: string;
  subCategory: string;
  price: number;
  rentalUnit: "hour" | "day" | "week" | "month";
  negotiable: boolean;

  // General info
  category: string;
  city: string;
  location: string;
  description: string;
  listedBy: "Owner" | "Agent" | "Company";
  contactName: string;
  contactPhone: string;

  // Images
  images: string[];

  // Attributes (category-specific fields only)
  attributes: {
    brand: string;
    model?: string;
    year: number;
    condition: "New" | "Used" | "Reconditioned";
    fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid";
    transmission: "Automatic" | "Manual" | "CVT" | "AMT";
  };

  isEditMode: boolean;

  // Actions
  setFormData: (data: Partial<VehicleFormState>) => void;
  setImages: (images: string[]) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  getFormData: () => any;
  reset: () => void;
  setEditMode: (isEdit: boolean) => void;
}

const initialState = {
  // Top-level fields
  title: "",
  subCategory: "cars",
  price: 0,
  rentalUnit: "day" as const,
  negotiable: false,

  // General info
  category: "vehicles",
  city: "Addis Ababa",
  location: "",
  description: "",
  listedBy: "Owner" as const,
  contactName: "",
  contactPhone: "",

  // Images
  images: [],

  // Attributes
  attributes: {
    brand: "",
    model: "",
    year: new Date().getFullYear(),
    condition: "Used" as const,
    fuelType: "Petrol" as const,
    transmission: "Automatic" as const,
  },

  isEditMode: false,
};

export const useVehicleFormStore = create<VehicleFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFormData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      setImages: (images) => set({ images }),

      addImage: (url) =>
        set((state) => ({
          images: [...state.images, url],
        })),

      removeImage: (url) =>
        set((state) => ({
          images: state.images.filter((img) => img !== url),
        })),

      getFormData: () => {
        const state = get();
        return {
          category: state.category,
          title: state.title,
          subCategory: state.subCategory,
          price: state.price,
          rentalUnit: state.rentalUnit,
          negotiable: state.negotiable,
          city: state.city,
          location: state.location,
          description: state.description,
          listedBy: state.listedBy,
          contactName: state.contactName,
          contactPhone: state.contactPhone,
          images: state.images,
          attributes: state.attributes,
        };
      },

      reset: () => set(initialState),

      setEditMode: (isEdit) => {
        if (isEdit) {
          localStorage.removeItem("vehicle-form-storage");
        }
        set({ isEditMode: isEdit });
      },
    }),
    {
      name: "vehicle-form-storage",
      partialize: (state) =>
        state.isEditMode
          ? {}
          : {
              title: state.title,
              subCategory: state.subCategory,
              price: state.price,
              rentalUnit: state.rentalUnit,
              negotiable: state.negotiable,
              category: state.category,
              city: state.city,
              location: state.location,
              description: state.description,
              listedBy: state.listedBy,
              contactName: state.contactName,
              contactPhone: state.contactPhone,
              images: state.images,
              attributes: state.attributes,
            },
    }
  )
);