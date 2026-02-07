// app/admin/users/page.tsx
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useUsers,
  useToggleUserStatus,
  useDeleteUser,
} from "@/lib/hooks/use-users";
import useUsersFilterStore from "@/lib/store/users-filter.store";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { TableSearch } from "@/components/data-table/table-search";
import { AdminTable } from "@/components/data-table/data-table";
import UsersFilters from "./users-filter";
import { getUsersColumns, User } from "./columns";
import { DeleteConfirmDialog } from "@/components/dialogs/delete-confirm-dialog";
import { UserFormModal } from "./user-form-modal";
import { toast } from "sonner";
import { useFetchData } from "@/lib/api/use-fetch-data";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // filters come from zustand store
  const { status } = useUsersFilterStore();

  const { data, isLoading } = useUsers({
    page,
    limit,
    query: search || undefined,
    status: status || undefined,
  });
  const usersData = useFetchData(
    ["getUsers", page, limit, status],
    `users/get-users?page=${page}&limit=${limit}`,
  );
  const _data = usersData?.data;

  if (usersData.isLoading) return <Loader className="py-5" />;
  if (usersData.isError)
    return <p>Something went wrong while fetching advert data!</p>;

  const { toggleUserStatusAsync, isToggling } = useToggleUserStatus();
  const { deleteUserAsync, isDeleting } = useDeleteUser();

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatusAsync(userId);
      toast.success(
        `User ${currentStatus ? "disabled" : "enabled"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to toggle user status",
      );
    }
  };

  const openCreateModal = () => {
    setModalMode("create");
    setSelectedUser(null);
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode("edit");
    setSelectedUser(user);
    setModalOpen(true);
  };

  const openDeleteDialog = (userId: string) => {
    setDeleteId(userId);
  };

  const closeDeleteDialog = () => {
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteUserAsync(deleteId);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeDeleteDialog();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage all customer accounts
          </p>
        </div>
      </div>

      {/* Search bar — filters & create button passed as children */}
      <TableSearch
        placeholder="Search users..."
        setDebouncedValue={(val) => {
          setPage(1);
          setSearch(val);
        }}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
      >
        <div className="flex space-x-2 items-center justify-center">
          {/* custom filter popover */}
          <UsersFilters />
          {/* create button */}
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </TableSearch>

      {/* Table — no filters prop, just data + columns + pagination */}
      <AdminTable
        data={_data || []}
        columns={getUsersColumns({
          onEdit: (id) => {
            const user = _data.find((u) => u.id === id);
            if (user) openEditModal(user);
          },
          onDelete: openDeleteDialog,
          onToggleStatus: handleToggleStatus,
        })}
        isLoading={isLoading || isToggling}
        pagination={{
          total: usersData?.total || 0,
          current: page,
          pageSize: limit,
          onChange: setPage,
          onPageSizeChange: setLimit,
        }}
        emptyMessage="No users found"
        rowClassName={(_, i) => (i % 2 === 1 ? "bg-gray-50" : "")}
      />

      {/* User Form Modal */}
      <UserFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        user={selectedUser}
        mode={modalMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={!!deleteId}
        onOpenChange={closeDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemName="this user"
      />
    </div>
  );
}
