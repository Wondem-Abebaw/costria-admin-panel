// app/admin/users/columns.tsx
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
import { MoreVertical, Edit, Trash2, User as UserIcon } from "lucide-react";
import { ColumnDef } from "@/components/data-table/data-table";
import { HeaderCell } from "@/components/data-table/header-cell";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  listingsCount?: number;
}

interface ColumnActions {
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function getUsersColumns(actions: ColumnActions): ColumnDef<User>[] {
  return [
    {
      title: <HeaderCell title="User" />,
      key: "user",
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
      title: <HeaderCell title="Listings" />,
      dataIndex: "listingsCount",
      key: "listingsCount",
      width: 100,
      render: (value: number) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-900">
            {value || 0}
          </span>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Status" />,
      key: "status",
      width: 120,
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={row.isActive}
            onCheckedChange={() => actions.onToggleStatus(row.id, row.isActive)}
          />
          <Badge
            variant={row.isActive ? "default" : "secondary"}
            className="capitalize"
          >
            {row.isActive ? "Active" : "Disabled"}
          </Badge>
        </div>
      ),
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => actions.onEdit(row.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => actions.onDelete(row.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
}
