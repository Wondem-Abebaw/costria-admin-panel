// app/admin/events/events-filter.tsx
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
import { ListingStatusOptions } from "@/lib/config/status-options";
import useEventsFilterStore from "@/lib/store/events-filter-store";

export const eventsSubCategoryOptions = [
  { label: "Catering Materials", value: "cateringMaterials" },
  { label: "Event Packages", value: "eventPackages" },
  { label: "Photography", value: "photography" },
  { label: "Videography", value: "videography" },
  { label: "DJ Services", value: "djServices" },
  { label: "Decoration", value: "decoration" },
  { label: "Makeup & Hair", value: "makeupHair" },
  { label: "MC Services", value: "mcServices" },
  { label: "Event Venues", value: "eventVenues" },
];

export const eventsCityOptions = [
  { label: "Addis Ababa", value: "Addis Ababa" },
  { label: "Dire Dawa", value: "Dire Dawa" },
  { label: "Hawassa", value: "Hawassa" },
  { label: "Bahir Dar", value: "Bahir Dar" },
  { label: "Mekelle", value: "Mekelle" },
  { label: "Gondar", value: "Gondar" },
  { label: "Jimma", value: "Jimma" },
];

const EventsFilters = () => {
  const [open, setOpen] = useState(false);

  const {
    subCategory,
    status,
    city,
    setSubCategory,
    setStatus,
    setCity,
    resetFilters,
  } = useEventsFilterStore();

  // local copies while popover is open so changes apply on "Apply"
  const [localSubCategory, setLocalSubCategory] = useState(subCategory);
  const [localStatus, setLocalStatus] = useState(status);
  const [localCity, setLocalCity] = useState(city);

  // sync local when popover opens
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalSubCategory(subCategory);
      setLocalStatus(status);
      setLocalCity(city);
    }
    setOpen(isOpen);
  };

  const handleApply = () => {
    setSubCategory(localSubCategory);
    setStatus(localStatus);
    setCity(localCity);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalSubCategory("");
    setLocalStatus("");
    setLocalCity("");
    resetFilters();
  };

  // active filter count badge
  const activeCount = [subCategory, status, city].filter(Boolean).length;

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

      <PopoverContent className="w-[440px] p-0" align="end">
        <div className="p-5 flex flex-col gap-5">
          {/* Title */}
          <h4 className="font-semibold text-gray-900">Event Service Filters</h4>

          {/* Grid of selects */}
          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Service Type</Label>
              <Select
                value={localSubCategory}
                onValueChange={setLocalSubCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {eventsSubCategoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-gray-500">Status</Label>
              <Select value={localStatus} onValueChange={setLocalStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {ListingStatusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-xs text-gray-500">City</Label>
              <Select value={localCity} onValueChange={setLocalCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {eventsCityOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear Filter
            </Button>
            <Button size="sm" onClick={handleApply}>
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default EventsFilters;
