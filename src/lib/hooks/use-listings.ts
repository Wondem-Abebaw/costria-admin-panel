// lib/hooks/use-listings.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listingsApi } from "../api/listings";
import { CreateListingRequest, UpdateListingRequest } from "../types/listings";

export function useListings() {
  const queryClient = useQueryClient();

  // Create listing
  const createMutation = useMutation({
    mutationFn: (data: CreateListingRequest) => listingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });

  // Update listing
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateListingRequest }) =>
      listingsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      listingsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      // console.log("🚀 ~ useListings ~ variables:", variables.id);
      queryClient.invalidateQueries({ queryKey: ["listing", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });

  // Delete listing
  const deleteMutation = useMutation({
    mutationFn: (id: string) => listingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });

  return {
    // Create
    createAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    // Update
    updateAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    // Update Status
    updateStatusAsync: updateStatusMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    // Delete
    deleteAsync: deleteMutation.mutateAsync,
    deleteListing: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

// Get single listing

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}

// Get user's listings
export function useMyListings(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["my-listings", page, limit],
    queryFn: () => listingsApi.getMyListings(page, limit),
    staleTime: 2 * 60 * 1000,
  });
}

// Increment contact view
export function useIncrementContactView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => listingsApi.incrementContactView(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["listing", id] });
    },
  });
}
