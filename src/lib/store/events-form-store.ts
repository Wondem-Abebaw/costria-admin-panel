// lib/store/events-form-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface EventsFormState {
  // Top-level fields (extracted from attributes)
  title: string;
  subCategory: string;
  eventsPrice: string; // Changed to string to handle flexible pricing
  rentalUnit: "hour" | "day" | "week" | "event";
  negotiable: boolean;

  // General info
  category: string;
  city: string;
  location: string;
  description: string;
  listedBy: "Owner" | "Agent" | "Company";
  contactName: string;
  contactPhone: string;

  // Images and video
  images: string[];
  videoUrl: string;

  // Attributes (category-specific fields only)
  attributes: {
    // For Catering Materials (የድግስ እቃዎች)
    materials?: string[];
    materialsAvailable?: string;

    // For Full Package (Hall with services)
    servicesIncluded?: string[];
    hallCapacity?: number;
    hallArea?: number;

    // For Halls Only (አዳራሽ)
    capacity?: number;
    area?: number;

    // Hall/Venue Amenities
    parkingAvailable?: boolean;
    parkingSpaces?: number;
    soundSystemIncluded?: boolean;
    lightingIncluded?: boolean;
    stageAvailable?: boolean;
    acAvailable?: boolean;
    waitingArea?: boolean;
    changingRooms?: number;
    kitchenFacilities?: boolean;
    outdoorSpace?: boolean;

    // Additional features
    features?: string[];
  };

  isEditMode: boolean;

  // Actions
  setFormData: (data: Partial<EventsFormState>) => void;
  setImages: (images: string[]) => void;
  setVideoUrl: (url: string) => void;
  addImage: (url: string) => void;
  removeImage: (url: string) => void;
  getFormData: () => any;
  reset: () => void;
  setEditMode: (isEdit: boolean) => void;
}

const initialState = {
  // Top-level fields
  title: "",
  subCategory: "cateringMaterials",
  eventsPrice: "",
  rentalUnit: "day" as const,
  negotiable: false,

  // General info
  category: "events",
  city: "",
  location: "",
  description: "",
  listedBy: "Owner" as const,
  contactName: "",
  contactPhone: "",

  // Images and video
  images: [],
  videoUrl: "",

  // Attributes
  attributes: {
    materials: [],
    materialsAvailable: "",
    servicesIncluded: [],
    hallCapacity: 0,
    hallArea: 0,
    capacity: 0,
    area: 0,
    parkingAvailable: false,
    parkingSpaces: 0,
    soundSystemIncluded: false,
    lightingIncluded: false,
    stageAvailable: false,
    acAvailable: false,
    waitingArea: false,
    changingRooms: 0,
    kitchenFacilities: false,
    outdoorSpace: false,
    features: [],
  },

  isEditMode: false,
};

export const useEventsFormStore = create<EventsFormState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setFormData: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      setImages: (images) => set({ images }),

      setVideoUrl: (url) => set({ videoUrl: url }),

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
          eventsPrice: state.eventsPrice,
          rentalUnit: state.rentalUnit,
          negotiable: state.negotiable,
          city: state.city,
          location: state.location,
          description: state.description,
          listedBy: state.listedBy,
          contactName: state.contactName,
          contactPhone: state.contactPhone,
          images: state.images,
          videoUrl: state.videoUrl,
          attributes: state.attributes,
        };
      },

      reset: () => set(initialState),

      setEditMode: (isEdit) => {
        if (isEdit) {
          localStorage.removeItem("events-form-storage");
        }
        set({ isEditMode: isEdit });
      },
    }),
    {
      name: "events-form-storage",
      partialize: (state) =>
        state.isEditMode
          ? {}
          : {
              title: state.title,
              subCategory: state.subCategory,
              eventsPrice: state.eventsPrice,
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
              videoUrl: state.videoUrl,
              attributes: state.attributes,
            },
    }
  )
);