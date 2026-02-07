// lib/store/residential-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ResidentialFormState {
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
    // Basic amenities
    furnished: boolean;
    furnishingLevel?: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
    parking: boolean;
    parkingSpaces?: number;
    parkingType?: "Covered" | "Open" | "Underground";

    // Kitchen & Appliances
    kitchen: boolean;
    kitchenType?: "Open" | "Closed" | "Semi-Open";
    refrigerator: boolean;
    stove: boolean;
    oven: boolean;
    microwave: boolean;
    dishwasher: boolean;
    washingMachine: boolean;

    // Climate Control
    airConditioning: boolean;
    heatingSystem: boolean;

    // Utilities
    internetIncluded: boolean;
    cableTV: boolean;
    hotWater: boolean;
    generator: boolean;

    // Security
    securitySystem: boolean;
    gatedCommunity: boolean;
    doorman: boolean;
    intercom: boolean;

    // Building Features
    elevator: boolean;
    gym: boolean;
    swimmingPool: boolean;
    playgroundArea: boolean;

    // Outdoor Features
    balcony: boolean;
    balconies?: number;
    terrace: boolean;
    garden: boolean;
    storage: boolean;

    // Policies
    petsAllowed: boolean;
    smokingAllowed: boolean;

    // Additional features
    features: string[];
    nearbyAmenities: string[];
  };

  isEditMode: boolean;

  // Actions
  setFormData: (data: Partial<ResidentialFormState>) => void;
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
  subCategory: "apartments",
  price: 0,
  rentalUnit: "month" as const,
  negotiable: false,

  // General info
  category: "residential-houses",
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
    furnished: false,
    furnishingLevel: "Unfurnished" as const,
    parking: false,
    parkingSpaces: 0,
    parkingType: "Open" as const,
    kitchen: false,
    kitchenType: "Closed" as const,
    refrigerator: false,
    stove: false,
    oven: false,
    microwave: false,
    dishwasher: false,
    washingMachine: false,
    airConditioning: false,
    heatingSystem: false,
    internetIncluded: false,
    cableTV: false,
    hotWater: false,
    generator: false,
    securitySystem: false,
    gatedCommunity: false,
    doorman: false,
    intercom: false,
    elevator: false,
    gym: false,
    swimmingPool: false,
    playgroundArea: false,
    balcony: false,
    balconies: 0,
    terrace: false,
    garden: false,
    storage: false,
    petsAllowed: false,
    smokingAllowed: false,
    features: [],
    nearbyAmenities: [],
  },

  isEditMode: false,
};

export const useResidentialFormStore = create<ResidentialFormState>()(
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
          localStorage.removeItem("residential-form-storage");
        }
        set({ isEditMode: isEdit });
      },
    }),
    {
      name: "residential-form-storage",
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