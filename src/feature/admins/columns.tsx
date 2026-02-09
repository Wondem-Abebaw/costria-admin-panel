// app/admin/admins/columns.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";
import {
  MoreVertical,
  Edit,
  Trash2,
  UserIcon,
  Power,
  Edit3,
  LockIcon,
} from "lucide-react";
import { ColumnDef } from "@/components/data-table/data-table";
import { HeaderCell } from "@/components/data-table/header-cell";

import { useModal } from "@/lib/hooks/use-modal";

import { ConfirmationModalContent } from "@/components/confirmation-modal-content";
import ModalButton from "@/components/modal-button";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AdminFormModalContent } from "./admin-form-modal";

export interface Admin {
  id: string;
  name: string;
  email?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
}

interface ColumnActions {
  onToggleStatus: (id: string, currentStatus: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

// Status switch component with modal
function StatusSwitch({ admin }: { admin: Admin }) {
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={admin.isActive ? "default" : "secondary"}
        className="capitalize"
      >
        {admin.isActive ? "Active" : "Disabled"}
      </Badge>
    </div>
  );
}

export function getAdminsColumns(actions: ColumnActions): ColumnDef<Admin>[] {
  return [
    {
      title: <HeaderCell title="Admin" />,
      key: "admin",
      width: 250,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email || "No email"}</p>
          </div>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Phone" />,
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: (value: string) => (
        <span className="text-sm text-gray-700">{value}</span>
      ),
    },
    {
      title: <HeaderCell title="Role" />,
      dataIndex: "role",
      key: "role",
      width: 100,
    },
    {
      title: <HeaderCell title="Statuss" />,
      key: "status",
      width: 120,
      render: (_, row) => <StatusSwitch admin={row} />,
    },
    {
      title: <HeaderCell title="Joined" />,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 130,
      render: (value: string) => (
        <span className="text-sm text-gray-500 whitespace-nowrap">
          {formatDistanceToNow(new Date(value), { addSuffix: true })}
        </span>
      ),
    },
    {
      title: <HeaderCell title="Actions" />,
      key: "actions",
      width: 70,
      render: (_, row) => (
        <div className="flex space-x-0">
          {" "}
          <Tooltip>
            <TooltipTrigger asChild>
              <ModalButton
                variant="ghost"
                icon={<Edit3 className=" h-4 w-4" />}
                view={<AdminFormModalContent admin={row} mode="edit" />}
                customSize="500px"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModalButton
                variant="ghost"
                icon={<LockIcon className=" h-4 w-4" />}
                view={
                  <ConfirmationModalContent
                    title={row.isActive ? "Disable Admin" : "Enable Admin"}
                    description={
                      row.isActive
                        ? `Are you sure you want to disable ${row.name}? They will not be able to access their account.`
                        : `Are you sure you want to enable ${row.name}? They will regain access to their account.`
                    }
                    onConfirm={() =>
                      actions.onToggleStatus(row.id, row.isActive)
                    }
                    type={row.isActive ? "warning" : "success"}
                    confirmText={row.isActive ? "Disable" : "Enable"}
                  />
                }
                customSize="500px"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.isActive ? "Disable Admin" : "Enable Admin"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ModalButton
                variant="ghost"
                icon={
                  <Trash2 className=" h-4 w-4 text-red-600 focus:text-red-600" />
                }
                view={
                  <ConfirmationModalContent
                    title="Delete Admin"
                    description={`Are you sure you want to delete ${row.name}? This action cannot be undone and will permanently remove all admin data and listings.`}
                    onConfirm={() => actions.onDelete(row.id)}
                    type="danger"
                    confirmText="Delete"
                  />
                }
                customSize="500px"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];
}
