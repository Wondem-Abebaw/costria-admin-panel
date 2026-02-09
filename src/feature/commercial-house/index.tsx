// app/admin/commercial/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminListings } from "@/lib/hooks/use-admin-listings";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TableSearch } from "@/components/data-table/table-search";
import { AdminTable } from "@/components/data-table/data-table";

import { getCommercialColumns } from "./columns";
import { UpdateStatusDialog } from "@/components/dialogs/update-status-dialog";
import { DeleteConfirmDialog } from "@/components/dialogs/delete-confirm-dialog";
import { useListingActions } from "@/lib/hooks/use-listing-actions";
import useCommercialFilterStore from "@/lib/store/commercial-filter.store";
import CommercialFilters from "./commercial-filter";

export default function CommercialPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  // filters come from zustand store
  const { subCategory, status, city } = useCommercialFilterStore();

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
    category: "commercial-houses",
    successMessages: {
      delete: "Commercial property listing deleted successfully",
      updateStatus: "Property status updated successfully",
    },
  });

  const { data, isLoading } = useAdminListings({
    category: "commercial-houses",
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
            Commercial Property Listings
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all commercial property rental listings
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
          <CommercialFilters />
          {/* create button */}
          <Button
            variant="default"
            onClick={() => router.push("/commercial/create")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </TableSearch>

      {/* Table — no filters prop, just data + columns + pagination */}
      <AdminTable
        data={data?.items || []}
        columns={getCommercialColumns({
          onEdit: (id) => router.push(`/commercial/edit/${id}`),
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
        emptyMessage="No commercial properties found"
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
        description="Change the availability status of this commercial property listing"
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemName="the commercial property listing"
      />
    </div>
  );
}
