// app/admin/residential/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminListings } from "@/lib/hooks/use-admin-listings";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TableSearch } from "@/components/data-table/table-search";
import { AdminTable } from "@/components/data-table/data-table";
import ResidentialFilters from "./residential-filter";
import { getResidentialColumns } from "./columns";
import { UpdateStatusDialog } from "@/components/dialogs/update-status-dialog";
import { DeleteConfirmDialog } from "@/components/dialogs/delete-confirm-dialog";
import { useListingActions } from "@/lib/hooks/use-listing-actions";
import useResidentialFilterStore from "@/lib/store/residential-filter-store";

export default function ResidentialPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  // filters come from zustand store
  const { subCategory, status, city } = useResidentialFilterStore();

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
    category: "residential-houses",
    successMessages: {
      delete: "Residential property listing deleted successfully",
      updateStatus: "Property status updated successfully",
    },
  });

  const { data, isLoading } = useAdminListings({
    category: "residential-houses",
    page,
    limit,
    query: search || undefined,
    subCategory: subCategory || undefined,
    status: status || undefined,
    city: city || undefined,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Residential Property Listings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all residential property rental listings
          </p>
        </div>
      </div>

      {/* Search bar — filters & create button passed as children */}
      <TableSearch
        placeholder="Search properties..."
        setDebouncedValue={(val) => {
          setPage(1);
          setSearch(val);
        }}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["admin-listings"] })
        }
      >
        <div className="flex space-x-2 items-center justify-center">
          {/* custom filter popover */}
          <ResidentialFilters />
          {/* create button */}
          <Button onClick={() => router.push("/residential/create")}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </TableSearch>

      {/* Table — no filters prop, just data + columns + pagination */}
      <AdminTable
        data={data?.items || []}
        columns={getResidentialColumns({
          onEdit: (id) => router.push(`/residential/edit/${id}`),
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
        emptyMessage="No residential properties found"
        rowClassName={(_, i) => (i % 2 === 1 ? "bg-gray-50" : "")}
      />

      {/* Update Status Dialog */}
      <UpdateStatusDialog
        open={!!statusUpdateData}
        onOpenChange={closeStatusDialog}
        currentStatus={statusUpdateData?.currentStatus || ""}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdatingStatus}
        title="Update Property Status"
        description="Change the availability status of this residential property listing"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemName="the residential property listing"
      />
    </div>
  );
}
