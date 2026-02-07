import { ReactNode, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  className,
  children,
}: TableSearchProps) {
  const [value, setValue] = useState("");

  const handleSearch = () => {
    setDebouncedValue(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 flex-wrap justify-between",
        className,
      )}
    >
      {/* Search Input */}
      <div className="relative flex-1 min-w-50 max-w-md">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pr-10"
        />

        {/* Search submit suffix */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={handleSearch}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-gray-200"
        >
          <Search className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {/* Everything else: filters, buttons, exports */}
      {children}
    </div>
  );
}
