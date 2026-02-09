// app/admin/admins/page.tsx
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAdmins,
  useToggleAdminStatus,
  useDeleteAdmin,
} from "@/lib/hooks/use-admins";

import { Plus } from "lucide-react";
import { TableSearch } from "@/components/data-table/table-search";
import { AdminTable } from "@/components/data-table/data-table";
import { getAdminsColumns } from "./columns";

import { toast } from "sonner";
import ModalButton from "@/components/modal-button";
import { AdminFormModalContent } from "./admin-form-modal";

export default function AdminsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useAdmins({
    page,
    limit,
    search: search || undefined,
  });
  // console.log("🚀 ~ AdminsPage ~ data:", data);

  const { toggleAdminStatusAsync, isToggling } = useToggleAdminStatus();
  const { deleteAdminAsync, isDeleting } = useDeleteAdmin();

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleAdminStatusAsync(userId);
      toast.success(
        `Admin ${currentStatus ? "disabled" : "enabled"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to toggle admin status",
      );
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteAdminAsync(userId);
      toast.success("Admin deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete admin");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admins Management
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all admin accounts
          </p>
        </div>
      </div>

      {/* Search bar — filters & create button passed as children */}
      <TableSearch
        placeholder="Search admins..."
        setDebouncedValue={(val) => {
          setPage(1);
          setSearch(val);
        }}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["admins"] })
        }
      >
        <div className="flex space-x-2 items-center justify-center">
          {/* create button using ModalButton */}
          <ModalButton
            label="Add Admin"
            icon={<Plus className="mr-2 h-4 w-4" />}
            view={<AdminFormModalContent mode="create" />}
            customSize="500px"
          />
        </div>
      </TableSearch>

      {/* Table — no filters prop, just data + columns + pagination */}
      <AdminTable
        data={data?.data || []}
        columns={getAdminsColumns({
          onToggleStatus: handleToggleStatus,
          onDelete: handleDelete,
        })}
        isLoading={isLoading || isToggling || isDeleting}
        pagination={{
          total: data?.total || 0,
          current: page,
          pageSize: limit,
          onChange: setPage,
          onPageSizeChange: setLimit,
        }}
        emptyMessage="No admins found"
        rowClassName={(_, i) => (i % 2 === 1 ? "bg-gray-50" : "")}
      />
    </div>
  );
}
