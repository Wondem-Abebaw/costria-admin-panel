import { cn } from "@/lib/utils";

// components/admin/table/header-cell.tsx
interface HeaderCellProps {
  title: string;
  className?: string;
}

export function HeaderCell({ title, className }: HeaderCellProps) {
  return (
    <div className={cn("font-semibold text-gray-900", className)}>{title}</div>
  );
}
