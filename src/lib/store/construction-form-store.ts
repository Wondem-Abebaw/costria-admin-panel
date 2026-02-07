// lib/store/equipment-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EquipmentFormState {
  // Top-level fields (extracted from attributes)
  title: string;
  subCategory: string;
  price: number;
  rentalUnit: string;
  negotiable: boolean;

  // General info
  category: string;
  city: string;
  location: string;
  description: string;
  listedBy:string;
  contactName: string;
  contactPhone: string;

  // Images
  images: string[];

  // Attributes (category-specific fields only)
  attributes: {
    // Vehicle-type machinery fields (conditional)
    brand?: string;
    model?: string;
    year?: number;
    condition?: string;
    fuelType?: string;

    // Equipment specs (optional, depends on type)
    operatingWeight?: string;
    bucketCapacity?: string;
    enginePower?: string;
    maxHeight?: string;
    maxLoad?: string;
    dimensions?: string;
  };

  isEditMode: boolean;

  // Actions
  setFormData: (data: Partial<EquipmentFormState>) => void;
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
  subCategory: "excavators",
  price: 0,
  rentalUnit: "day" as const,
  negotiable: false,

  // General info
  category: "construction-equipment",
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
    fuelType: "Diesel" as const,
    operatingWeight: "",
    bucketCapacity: "",
    enginePower: "",
    maxHeight: "",
    maxLoad: "",
    dimensions: "",
  },

  isEditMode: false,
};

export const useEquipmentFormStore = create<EquipmentFormState>()(
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
          localStorage.removeItem("equipment-form-storage");
        }
        set({ isEditMode: isEdit });
      },
    }),
    {
      name: "equipment-form-storage",
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