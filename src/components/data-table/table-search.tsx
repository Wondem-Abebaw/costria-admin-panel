import { ReactNode, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  placeholder?: string;
  setDebouncedValue: (value: string) => void;
  onRefresh?: () => void;
  className?: string;
  children?: ReactNode;
}

export function TableSearch({
  placeholder = "Search...",
  setDebouncedValue,
  onRefresh,
  className,
  children,
}: TableSearchProps) {
  const [value, setValue] = useState("");

  // debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, 300);
    return () => clearTimeout(timer);
  }, [value, setDebouncedValue]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 flex-wrap justify-between",
        className,
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Refresh
      {onRefresh && (
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      )} */}

      {/* Everything else: filters, buttons, exports — passed as children */}
      {children}
    </div>
  );
}

// ──────────────────────────────────────────
// HeaderCell  (small helper for column titles)
// ──────────────────────────────────────────

interface HeaderCellProps {
  title: string;
  className?: string;
}

export function HeaderCell({ title, className }: HeaderCellProps) {
  return (
    <span className={cn("font-semibold text-gray-700 text-sm", className)}>
      {title}
    </span>
  );
}
