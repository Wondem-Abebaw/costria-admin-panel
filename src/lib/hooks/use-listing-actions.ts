import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useListings } from "./use-listings";
import { useDeleteAdminListing } from "./use-admin-listings";

interface UseListingActionsOptions {
  category: string;
  successMessages?: {
    delete?: string;
    updateStatus?: string;
  };
  onSuccess?: {
    delete?: () => void;
    updateStatus?: () => void;
  };
}

export function useListingActions(options: UseListingActionsOptions) {
  const { category, successMessages, onSuccess } = options;
  const queryClient = useQueryClient();

  // State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusUpdateData, setStatusUpdateData] = useState<{
    id: string;
    currentStatus: string;
  } | null>(null);

  // Mutations
  const deleteMutation = useDeleteAdminListing();
  const { updateStatusAsync, isUpdatingStatus } = useListings();

  // Handlers
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success(
        successMessages?.delete || `${category} deleted successfully`
      );
      setDeleteId(null);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      
      // Custom callback
      onSuccess?.delete?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || `Failed to delete ${category}`
      );
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    console.log("🚀 ~ handleUpdateStatus ~ newStatus:", newStatus)
    if (!statusUpdateData) return;

    try {
      await updateStatusAsync({
        id: statusUpdateData.id,
        status: newStatus,
      });
      toast.success(
        successMessages?.updateStatus || `Status updated to ${newStatus}`
      );
      setStatusUpdateData(null);
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["admin-listings"] });
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
      queryClient.invalidateQueries({ 
        queryKey: ["listing", statusUpdateData.id] 
      });
      
      // Custom callback
      onSuccess?.updateStatus?.();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update status"
      );
    }
  };

  const openDeleteDialog = (id: string) => setDeleteId(id);
  const closeDeleteDialog = () => setDeleteId(null);

  const openStatusDialog = (id: string, currentStatus: string) => {
    setStatusUpdateData({ id, currentStatus });
  };
  const closeStatusDialog = () => setStatusUpdateData(null);

  return {
    // Delete
    deleteId,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isDeleting: deleteMutation.isPending,

    // Status
    statusUpdateData,
    openStatusDialog,
    closeStatusDialog,
    handleUpdateStatus,
    isUpdatingStatus,
  };
}