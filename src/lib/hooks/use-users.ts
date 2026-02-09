// lib/hooks/use-users.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";

// Types
export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  listingsCount?: number;
}

interface UsersResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

interface UsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface CreateUserData {
  name: string;
  email?: string;
  phone: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
}

// Get all users with filters
export function useUsers(params?: UsersParams) {
  return useQuery<UsersResponse>({
    queryKey: ["users", params],
    queryFn: async () => {
      const response = await apiClient.get("/users/get-users", { params });
      return response.data;
    },
  });
}

// Get single user
export function useUser(id: string) {
  return useQuery<User>({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create user
export function useCreateUser() {
  const mutation = useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    },
  });

  return {
    createUserAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
}

// Update user
export function useUpdateUser() {
  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserData;
    }) => {
      const response = await apiClient.put(`/admin/users/${id}`, data);
      return response.data;
    },
  });

  return {
    updateUserAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}

// Toggle user status (enable/disable)
export function useToggleUserStatus() {
  const mutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.patch(`/users/${userId}/change-status`);
      return response.data;
    },
  });

  return {
    toggleUserStatusAsync: mutation.mutateAsync,
    isToggling: mutation.isPending,
  };
}

// Delete user
export function useDeleteUser() {
  const mutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },
  });

  return {
    deleteUserAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
  };
}