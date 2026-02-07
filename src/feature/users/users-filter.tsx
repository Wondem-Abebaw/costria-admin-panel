// app/admin/users/users-filter.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import useUsersFilterStore from "@/lib/store/users-filter.store";

export const userStatusOptions = [
  { label: "Active", value: "active" },
  { label: "Disabled", value: "disabled" },
];

const UsersFilters = () => {
  const [open, setOpen] = useState(false);

  const { status, setStatus, resetFilters } = useUsersFilterStore();

  // local copy while popover is open so changes apply on "Apply"
  const [localStatus, setLocalStatus] = useState(status);

  // sync local when popover opens
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalStatus(status);
    }
    setOpen(isOpen);
  };

  const handleApply = () => {
    setStatus(localStatus);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalStatus("");
    resetFilters();
  };

  // active filter count badge
  const activeCount = status ? 1 : 0;

  return (
    <Popover open={open} onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 whitespace-nowrap"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold bg-primary text-white rounded-full">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-0" align="end">
        <div className="p-5 flex flex-col gap-5">
          {/* Title */}
          <h4 className="font-semibold text-gray-900">User Filters</h4>

          {/* Status Filter */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-gray-500">Account Status</Label>
            <Select value={localStatus} onValueChange={setLocalStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {userStatusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear Filter
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UsersFilters;
