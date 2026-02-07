"use client";

import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ListingStatusOptions } from "@/lib/config/status-options";

interface UpdateStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: string;

  onConfirm: (newStatus: string) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
}

export function UpdateStatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onConfirm,
  isLoading = false,
  title = "Update Status",
  description = "Change the status of this item",
  itemName = "item",
}: UpdateStatusDialogProps) {

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  const handleConfirm = () => {
    if (selectedStatus && selectedStatus !== currentStatus) {
      onConfirm(selectedStatus);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus, open]);

  const isDisabled =
    !selectedStatus || selectedStatus === currentStatus || isLoading;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Label htmlFor="status" className="text-sm font-medium">
            Select New Status
          </Label>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
            disabled={isLoading}
          >
            <SelectTrigger id="status" className="mt-2 w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ListingStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="capitalize">{option.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDisabled}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Updating..." : "Update Status"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
