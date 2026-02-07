// import { ColumnDef, HeaderCell } from "@/components/admin/table/admin-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { Listing } from "@/lib/types/listings";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { MoreVertical, Eye, Edit, Trash2, Rotate3d } from "lucide-react";
import { ColumnDef } from "@/components/data-table/data-table";
import { HeaderCell } from "@/components/data-table/header-cell";
import { Listing } from "@/lib/types/listings";

interface ColumnActions {
  onUpdateStatus: (id: string, currentStatus: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function getVehicleColumns(
  actions: ColumnActions,
): ColumnDef<Listing>[] {
  return [
    {
      title: <HeaderCell title="Vehicle" />,
      key: "vehicle",
      width: 240,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          {row.images?.[0] ? (
            <></>
          ) : (
            // <Image
            //   src={row.images[0]}
            //   alt={row.title}
            //   width={48}
            //   height={48}
            //   className="rounded object-cover"
            // />
            <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400 text-xs">No img</span>
            </div>
          )}
          <div>
            <p className="font-medium text-sm text-gray-900">{row.title}</p>
            <p className="text-xs text-gray-500">
              {row.attributes?.brand} {row.attributes?.model}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Type" />,
      dataIndex: "subCategory",
      key: "subCategory",
      width: 100,
      render: (value: string) => (
        <span className="capitalize text-sm text-gray-700">{value}</span>
      ),
    },
    {
      title: <HeaderCell title="Owner" />,
      key: "owner",
      width: 170,
      render: (_, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {row.user?.name || row.contactName}
          </p>
          <p className="text-xs text-gray-500">
            {row.user?.phone || row.contactPhone}
          </p>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Price" />,
      key: "price",
      width: 110,
      render: (_, row) => (
        <div>
          <p className="font-semibold text-sm text-gray-900">{row.price} ETB</p>
          <p className="text-xs text-gray-500">per {row.rentalUnit}</p>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Location" />,
      key: "location",
      width: 140,

      render: (_, row) => (
        <div>
          <p className="text-sm text-gray-900">{row.city}</p>
          <p className="text-xs text-gray-500">{row.location}</p>
        </div>
      ),
    },
    {
      title: <HeaderCell title="Status" />,
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (value: string) => (
        <Badge
          variant={
            value === "available"
              ? "default"
              : value === "rented"
                ? "secondary"
                : "outline"
          }
          className="capitalize"
        >
          {value}
        </Badge>
      ),
    },
    {
      title: <HeaderCell title="Posted" />,
      dataIndex: "postedDate",
      key: "postedDate",
      width: 120,
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
            <DropdownMenuItem
              onClick={() => actions.onUpdateStatus(row.id, row.status)}
            >
              <Rotate3d className="h-4 w-4 mr-2" />
              Change Status
            </DropdownMenuItem>
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
