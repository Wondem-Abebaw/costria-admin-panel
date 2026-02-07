
// lib/api/admin.ts
import { apiClient } from "./client";
import {
  User,
  CreateAdminRequest,
  AdminStats,
  UserRole,
} from "../types/admin";
import {
  Listing,
  PaginatedResponse,
  CreateListingRequest,
  UpdateListingRequest,
  SearchListingParams,
} from "../types/listings";

export const adminApi = {
  // Users Management
  users: {
    getAll: async (params: {
      page?: number;
      limit?: number;
      role?: UserRole;
      search?: string;
    }): Promise<PaginatedResponse<User>> => {
      const { data } = await apiClient.get<PaginatedResponse<User>>(
        "/admin/users",
        { params }
      );
      return data;
    },

    getCustomers: async (): Promise<User[]> => {
      const { data } = await apiClient.get<User[]>("/users/get-users");
      return data;
    },

    createAdmin: async (data: CreateAdminRequest): Promise<User> => {
      const response = await apiClient.post<User>("/admin/users/admins", data);
      return response.data;
    },

    updateRole: async (id: string, role: UserRole): Promise<User> => {
      const response = await apiClient.patch<User>(
        `/admin/users/${id}/role`,
        { role }
      );
      return response.data;
    },

    updateStatus: async (id: string, isActive: boolean): Promise<User> => {
      const response = await apiClient.patch<User>(
        `/admin/users/${id}/status`,
        { isActive }
      );
      return response.data;
    },
  },

  // Listings Management
  listings: {
    getAll: async (
      params: SearchListingParams
    ): Promise<PaginatedResponse<Listing>> => {
      const { data } = await apiClient.get<PaginatedResponse<Listing>>(
        "/listings",
        { params }
      );
      return data;
    },

    create: async (
      data: CreateListingRequest & { userId?: string }
    ): Promise<Listing> => {
      const response = await apiClient.post<Listing>("/admin/listings", data);
      return response.data;
    },

    update: async (
      id: string,
      data: UpdateListingRequest
    ): Promise<Listing> => {
      const response = await apiClient.patch<Listing>(
        `/admin/listings/${id}`,
        data
      );
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await apiClient.delete(`/admin-listings/${id}`);
    },

    getStats: async (): Promise<AdminStats> => {
      const { data } = await apiClient.get<AdminStats>(
        "/admin/listings/stats/overview"
      );
      return data;
    },
  },
};


