// lib/hooks/use-admin.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "../api/admin";
import { CreateAdminRequest, UserRole } from "../types/admin";
import { CreateListingRequest, SearchListingParams, UpdateListingRequest } from "../types/listings";

// Users hooks
export function useAdminUsers(params?: {
  page?: number;
  limit?: number;
  role?: UserRole;
  search?: string;
}) {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminApi.users.getAll(params || {}),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => adminApi.users.getCustomers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAdminRequest) => adminApi.users.createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
      adminApi.users.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.users.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// Listings hooks
export function useAdminListings(params?: SearchListingParams) {
  return useQuery({
    queryKey: ["admin-listings", params],
    queryFn: () => adminApi.listings.getAll(params || {}),
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminApi.listings.getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateAdminListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateListingRequest & { userId?: string }) =>
      adminApi.listings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useUpdateAdminListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingRequest }) =>
      adminApi.listings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
    },
  });
}

export function useDeleteAdminListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminApi.listings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}