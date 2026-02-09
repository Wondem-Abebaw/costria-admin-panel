// lib/hooks/use-admins.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// Types
export interface Admin {
  id: string;
  name: string;
  email?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  listingsCount?: number;
}

interface AdminsResponse {
  items: Admin[];
  total: number;
  page: number;
  limit: number;
}

interface AdminsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface CreateAdminData {
  name: string;
  email?: string;
  phone: string;
}

interface UpdateAdminData {
  name?: string;
  email?: string;
  phone?: string;
}

// Get all admins with filters
export function useAdmins(params?: AdminsParams) {
  return useQuery<AdminsResponse>({
    queryKey: ["admins", params],
    queryFn: async () => {
      const response = await apiClient.get("/admins/get-admins", { params });
      return response.data;
    },
  });
}

// Get single admin
export function useAdmin(id: string) {
  return useQuery<Admin>({
    queryKey: ["admin", id],
    queryFn: async () => {
      const response = await apiClient.get(`/admins/${id}/get-admin`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create admin
export function useCreateAdmin() {
  const mutation = useMutation({
    mutationFn: async (data: CreateAdminData) => {
      const response = await apiClient.post("/admins/create-admin", data);
      return response.data;
    },
  });

  return {
    createAdminAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}

// Update admin
export function useUpdateAdmin() {
  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAdminData;
    }) => {
      const response = await apiClient.put(`/admins/update-admin/${id}`, data);
      return response.data;
    },
  });

  return {
    updateAdminAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

// Toggle admin status (enable/disable)
export function useToggleAdminStatus() {
  const mutation = useMutation({
    mutationFn: async (adminId: string) => {
      const response = await apiClient.patch(`/admins/${adminId}/change-status`);
      return response.data;
    },
  });

  return {
    toggleAdminStatusAsync: mutation.mutateAsync,
    isToggling: mutation.isPending,
  };
}

// Delete admin
export function useDeleteAdmin() {
  const mutation = useMutation({
    mutationFn: async (adminId: string) => {
      const response = await apiClient.delete(`/admins/delete-admin/${adminId}`);
      return response.data;
    },
  });

  return {
    deleteAdminAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}