// lib/api/listings.ts
import {
  Listing,
  PaginatedResponse,
  CreateListingRequest,
  UpdateListingRequest,
  SearchListingParams,
} from "../types/listings";
import { apiClient } from "./client";
import { publicApiClient } from "./public-client";

export const listingsApi = {
  // Create listing (unified for all categories)
  create: async (data: CreateListingRequest): Promise<Listing> => {
    const response = await apiClient.post<Listing>("/admin-listings/create", data);
    return response.data;
  },

  // Get single listing (public)
  getById: async (id: string): Promise<Listing> => {
    const { data } = await publicApiClient.get<Listing>(`/listings/${id}`);
    return data;
  },

  // Search listings with filters (public)
  search: async (
    params: SearchListingParams
  ): Promise<PaginatedResponse<Listing>> => {
    const { data } = await publicApiClient.get<PaginatedResponse<Listing>>(
      "/listings",
      { params }
    );
    return data;
  },

  // Get trending listings (public)
  getTrending: async (limit = 10): Promise<Listing[]> => {
    const { data } = await publicApiClient.get<Listing[]>(
      "/listings/trending",
      { params: { limit } }
    );
    return data;
  },

  // Get listings by category (public)
  getByCategory: async (category: string, limit = 20): Promise<Listing[]> => {
    const { data } = await publicApiClient.get<Listing[]>(
      `/listings/category/${category}`,
      { params: { limit } }
    );
    return data;
  },

  // Get listings by city (public)
  getByCity: async (city: string, limit = 20): Promise<Listing[]> => {
    const { data } = await publicApiClient.get<Listing[]>(
      `/listings/city/${city}`,
      { params: { limit } }
    );
    return data;
  },

  // Get statistics (public)
  getStatsByCategory: async (): Promise<
    { category: string; count: string }[]
  > => {
    const { data } = await publicApiClient.get("/listings/stats/category");
    return data;
  },

  getStatsByCity: async (): Promise<{ city: string; count: string }[]> => {
    const { data } = await publicApiClient.get("/listings/stats/city");
    return data;
  },

  // Increment contact view (public)
  incrementContactView: async (
    id: string
  ): Promise<{ contactViews: number }> => {
    const { data } = await publicApiClient.post<{ contactViews: number }>(
      `/listings/${id}/contact-view`
    );
    return data;
  },

  // Update listing (requires auth)
  update: async (id: string, data: UpdateListingRequest): Promise<Listing> => {
    const response = await apiClient.patch<Listing>(`/listings/${id}`, data);
    return response.data;
  },

  // Update listing status (requires auth)
  updateStatus: async (id: string, status: string): Promise<Listing> => {
    const response = await apiClient.patch<Listing>(
      `/listings/change-status/${id}`,
      {
        status,
      }
    );
    return response.data;
  },

  // Delete listing (requires auth)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/listings/${id}`);
  },

  // Add images to listing (requires auth)
  addImages: async (id: string, imageUrls: string[]): Promise<Listing> => {
    const response = await apiClient.post<Listing>(`/listings/${id}/images`, {
      imageUrls,
    });
    return response.data;
  },

  // Remove images from listing (requires auth)
  removeImages: async (id: string, imageUrls: string[]): Promise<Listing> => {
    const response = await apiClient.delete<Listing>(`/listings/${id}/images`, {
      data: { imageUrls },
    });
    return response.data;
  },

  // Get user's listings (requires auth)
  getMyListings: async (page = 1, limit = 10): Promise<any> => {
    const { data } = await apiClient.get("/users/me/listings", {
      params: { page, limit },
    });
    return data;
  },
};
