"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminListings, useDeleteAdminListing } from "@/lib/hooks/use-admin";

import useVehicleFilterStore from "@/lib/store/vehicle-filter.store";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { TableSearch } from "@/components/data-table/table-search";

import { AdminTable } from "@/components/data-table/data-table";
import VehicleFilters from "./vehicle-filter";
import { getVehicleColumns } from "./columns";

export default function VehiclesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // filters come from zustand store (same as MerchantFilters pattern)
  const { subCategory, status, city } = useVehicleFilterStore();

  const { data, isLoading } = useAdminListings({
    category: "vehicles",
    page,
    limit,
    query: search || undefined,
    subCategory: subCategory || undefined,
    status: status || undefined,
    city: city || undefined,
  });

  const deleteMutation = useDeleteAdminListing();

  // ── handlers ──
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Vehicle listing deleted successfully");
      setDeleteId(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete listing");
    }
  };

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
          onView: (id) => router.push(`/listings/${id}`),
          onEdit: (id) => router.push(`/admin/vehicles/edit/${id}`),
          onDelete: (id) => setDeleteId(id),
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

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vehicle listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
