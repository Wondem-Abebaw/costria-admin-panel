// lib/store/commercial-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CommercialFormState {
  // Top-level fields (extracted from attributes)
  title: string;
  subCategory: string;
  price: number;
  rentalUnit: "day" | "week" | "month" | "year";
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
    area: number;
    floor?: number;
    offices?: number;
    furnished: boolean;
    parking: boolean;
    parkingSpaces?: number;
    securitySystem: boolean;
    internetIncluded: boolean;
    airConditioning: boolean;
    elevator: boolean;
    generator: boolean;
    kitchenette: boolean;
    receptionArea: boolean;
    loadingDock?: boolean;
    features: string[];
    nearbyAmenities: string[];
  };

  isEditMode: boolean;

  // Actions
  setFormData: (data: Partial<CommercialFormState>) => void;
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
  subCategory: "office-space",
  price: 0,
  rentalUnit: "month" as const,
  negotiable: false,

  // General info
  category: "commercial-houses",
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
    area: 0,
    floor: 0,
    offices: 0,
    furnished: false,
    parking: false,
    parkingSpaces: 0,
    securitySystem: false,
    internetIncluded: false,
    airConditioning: false,
    elevator: false,
    generator: false,
    kitchenette: false,
    receptionArea: false,
    loadingDock: false,
    features: [],
    nearbyAmenities: [],
  },

  isEditMode: false,
};

export const useCommercialFormStore = create<CommercialFormState>()(
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
          localStorage.removeItem("commercial-form-storage");
        }
        set({ isEditMode: isEdit });
      },
    }),
    {
      name: "commercial-form-storage",
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