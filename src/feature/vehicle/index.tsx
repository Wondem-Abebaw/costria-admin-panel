"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdminListings,
  useDeleteAdminListing,
} from "@/lib/hooks/use-admin-listings";

import useVehicleFilterStore from "@/lib/store/vehicle-filter.store";
import { Button } from "@/components/ui/button";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSearch } from "@/components/data-table/table-search";

import { AdminTable } from "@/components/data-table/data-table";
import VehicleFilters from "./vehicle-filter";
import { getVehicleColumns } from "./columns";
import { UpdateStatusDialog } from "@/components/dialogs/update-status-dialog";
import { DeleteConfirmDialog } from "@/components/dialogs/delete-confirm-dialog";
import { useListingActions } from "@/lib/hooks/use-listing-actions";

export default function VehiclesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  // filters come from zustand store (same as MerchantFilters pattern)
  const { subCategory, status, city } = useVehicleFilterStore();
  const {
    deleteId,
    openDeleteDialog,
    closeDeleteDialog,
    handleDelete,
    isDeleting,
    statusUpdateData,
    openStatusDialog,
    closeStatusDialog,
    handleUpdateStatus,
    isUpdatingStatus,
  } = useListingActions({
    category: "vehicle",
    successMessages: {
      delete: "Vehicle listing deleted successfully",
      updateStatus: "Vehicle status updated successfully",
    },
  });

  const { data, isLoading } = useAdminListings({
    category: "vehicles",
    page,
    limit,
    query: search || undefined,
    subCategory: subCategory || undefined,
    status: status || undefined,
    city: city || undefined,
  });

  // ── handlers ──

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vehicle Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all vehicle rental listings
          </p>
        </div>
      </div>

      {/* Search bar  —  filters & create button passed as children */}
      <TableSearch
        placeholder="Search vehicles..."
        setDebouncedValue={(val) => {
          setPage(1);
          setSearch(val);
        }}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["admin-listings"] })
        }
      >
        <div className=" flex space-x-2 items-center justify-center">
          {" "}
          {/* custom filter popover */}
          <VehicleFilters />
          {/* create button */}
          <Button onClick={() => router.push("/vehicles/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </TableSearch>

      {/* Table  —  no filters prop, just data + columns + pagination */}
      <AdminTable
        data={data?.items || []}
        columns={getVehicleColumns({
          onEdit: (id) => router.push(`/vehicles/edit/${id}`),
          onDelete: openDeleteDialog,
          onUpdateStatus: openStatusDialog,
        })}
        isLoading={isLoading}
        pagination={{
          total: data?.total || 0,
          current: page,
          pageSize: limit,
          onChange: setPage,
          onPageSizeChange: setLimit,
        }}
        emptyMessage="No vehicles found"
        rowClassName={(_, i) => (i % 2 === 1 ? "bg-gray-50" : "")}
      />

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={!!statusUpdateData}
        onOpenChange={closeStatusDialog}
        currentStatus={statusUpdateData?.currentStatus || ""}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdatingStatus}
        title="Update Vehicle Status"
        description="Change the availability status of this vehicle listing"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemName="the vehicle listing"
      />
    </div>
  );
}
