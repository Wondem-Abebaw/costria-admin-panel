// components/admin/table/admin-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ──────────────────────────────────────────
// Types
// ──────────────────────────────────────────

export interface ColumnDef<T> {
  title: string | React.ReactNode;
  dataIndex?: string;
  key: string;
  width?: number;
  className?: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export interface PaginationOptions {
  total: number;
  current: number;
  pageSize: number;
  onChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  // Pagination
  pagination?: PaginationOptions;
  // Styling
  className?: string;
  // Empty
  emptyMessage?: string;
  // Row
  rowClassName?: string | ((row: T, index: number) => string);
}

// ──────────────────────────────────────────
// AdminTable
// ──────────────────────────────────────────

export function AdminTable<T extends { id: string }>({
  data,
  columns,
  isLoading = false,
  pagination,
  className,
  emptyMessage = "No data found",
  rowClassName,
}: AdminTableProps<T>) {
  const getRowClass = (row: T, index: number) => {
    if (typeof rowClassName === "function") return rowClassName(row, index);
    return rowClassName || "";
  };

  // ── Pagination helpers ──
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  const getPageNumbers = () => {
    if (!pagination) return [];
    const pages: number[] = [];
    const max = 5;
    const { current } = pagination;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (current <= 3) {
      for (let i = 1; i <= max; i++) pages.push(i);
    } else if (current >= totalPages - 2) {
      for (let i = totalPages - max + 1; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Table */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  style={col.width ? { width: col.width } : undefined}
                  className={col.className}
                >
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, idx) => (
                <TableRow key={row.id} className={getRowClass(row, idx)}>
                  {columns.map((col) => {
                    const value = col.dataIndex
                      ? (row as any)[col.dataIndex]
                      : row;
                    return (
                      <TableCell key={col.key} className={col.className}>
                        {col.render ? col.render(value, row, idx) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(
              pagination.current * pagination.pageSize,
              pagination.total,
            )}{" "}
            of {pagination.total} results
          </p>

          <div className="flex items-center gap-2">
            {pagination.onPageSizeChange && (
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(v) => pagination.onPageSizeChange!(parseInt(v))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 / page</SelectItem>
                  <SelectItem value="20">20 / page</SelectItem>
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                </SelectContent>
              </Select>
            )}

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onChange(Math.max(1, pagination.current - 1))
                }
                disabled={pagination.current === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {getPageNumbers().map((num) => (
                <Button
                  key={num}
                  variant={pagination.current === num ? "default" : "outline"}
                  size="sm"
                  onClick={() => pagination.onChange(num)}
                  className="min-w-[40px]"
                >
                  {num}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  pagination.onChange(
                    Math.min(totalPages, pagination.current + 1),
                  )
                }
                disabled={pagination.current === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
