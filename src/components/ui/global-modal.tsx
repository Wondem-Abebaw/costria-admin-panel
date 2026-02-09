// components/admin/global-modal.tsx
"use client";

import { useModal } from "@/lib/hooks/use-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function GlobalModal() {
  const {
    isOpen,
    view,
    closeModal,
    customSize,
    containerClassName,
    rounded,
    position,
  } = useModal();

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent
        className={cn(
          containerClassName,
          position === "right" && "fixed right-0 top-0 h-full translate-x-0",
        )}
        style={{ maxWidth: customSize }}
      >
        {view}
      </DialogContent>
    </Dialog>
  );
}
