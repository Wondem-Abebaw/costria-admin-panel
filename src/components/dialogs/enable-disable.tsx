"use client";

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
import { cn } from "@/lib/utils";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  itemName?: string;
  isActive?: boolean;
}

export function EnableDisableDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Are you sure?",
  description,
  itemName = "this item",
  isActive,
}: DeleteConfirmDialogProps) {
  const defaultDescription = `This action cannot be undone. This will permanently delete ${itemName}.`;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={
              isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:green-red-700"
            }
          >
            {isActive ? "Disable" : "Enable"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
