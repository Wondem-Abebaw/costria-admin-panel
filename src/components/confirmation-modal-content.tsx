// components/admin/confirmation-modal-content.tsx
"use client";

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2 } from "lucide-react";
import { useModal } from "@/lib/hooks/use-modal";
// import { PiCheckCircleFill } from "react-icons/pi";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  type?: "danger" | "warning" | "success";
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmationModalContent({
  title,
  description,
  onConfirm,
  isLoading = false,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
}: Props) {
  const { closeModal } = useModal();

  const handleConfirm = async () => {
    await onConfirm();
    closeModal();
  };

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
      case "success":
        return <CheckCheck className="w-12 h-12 text-green-500" />;
      default:
        return <AlertTriangle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="rounded-full bg-gray-100 p-3">{getIcon()}</div>

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-gray-500">
            {description}
          </DialogDescription>
        </DialogHeader>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Button
          variant="outline"
          className="px-6 py-4"
          onClick={closeModal}
          disabled={isLoading}
        >
          {cancelText}
        </Button>

        <Button
          className={cn("px-6 py-4", getButtonClass())}
          onClick={handleConfirm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            confirmText
          )}
        </Button>
      </div>
    </div>
  );
}
