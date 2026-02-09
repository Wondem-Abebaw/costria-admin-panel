// components/admin/modal-button.tsx
import React, { forwardRef } from "react";
import { Plus } from "lucide-react";
import { useModal } from "@/lib/hooks/use-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalButtonProps {
  label?: string;
  view: React.ReactNode;
  customSize?: string;
  className?: string;
  icon?: boolean | React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?:
    | "default"
    | "outline"
    | "ghost"
    | "destructive"
    | "secondary"
    | "link";
  size?: "sm" | "default" | "lg" | "icon";
  id?: string;
}

const ModalButton = forwardRef<HTMLButtonElement, ModalButtonProps>(
  (
    {
      label,
      view,
      customSize,
      className,
      icon = true,
      type = "button",
      disabled,
      variant = "default",
      size = "default",
      id,
      ...props
    },
    ref,
  ) => {
    const { openModal } = useModal();

    if (label) {
      return (
        <Button
          {...props}
          id={id}
          ref={ref}
          type={type}
          size={size}
          disabled={disabled}
          variant={variant}
          className={cn(className, "whitespace-nowrap")}
          onClick={() =>
            openModal({
              view,
              customSize,
            })
          }
        >
          {typeof icon === "boolean" && icon && (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {typeof icon !== "boolean" && icon}
          {label}
        </Button>
      );
    }

    return (
      <Button
        {...props}
        id={id}
        ref={ref}
        size="icon"
        variant={variant}
        className={cn("hover:text-gray-700", className)}
        onClick={() =>
          openModal({
            view,
            customSize,
          })
        }
      >
        {typeof icon === "boolean"
          ? icon && <Plus className="h-4 w-4" />
          : icon}
      </Button>
    );
  },
);

ModalButton.displayName = "ModalButton";

export default ModalButton;
