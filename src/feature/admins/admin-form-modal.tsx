// app/admin/users/admin-form-modal-content.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";
import { useModal } from "@/lib/hooks/use-modal";
import { useCreateAdmin, useUpdateAdmin } from "@/lib/hooks/use-admins";

// Zod Validation Schema
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .email("Valid email is required")
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
});

type AdminFormData = z.infer<typeof userSchema>;

interface Admin {
  id: string;
  name: string;
  email?: string;
  phone: string;
}

interface Props {
  admin?: Admin | null;
  mode: "create" | "edit";
}

export function AdminFormModalContent({ admin, mode }: Props) {
  const queryClient = useQueryClient();
  const { closeModal } = useModal();
  const { createAdminAsync, isCreating } = useCreateAdmin();
  const { updateAdminAsync, isUpdating } = useUpdateAdmin();

  const form = useForm<AdminFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: admin?.name || "",
      email: admin?.email || "",
      phone: admin?.phone || "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  // Populate form when editing
  useEffect(() => {
    if (mode === "edit" && admin) {
      setValue("name", admin.name || "");
      setValue("email", admin.email || "");
      setValue("phone", admin.phone || "");
    }
  }, [mode, admin, setValue]);

  const onSubmit = async (data: AdminFormData) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        ...(data.email && { email: data.email }),
      };

      if (mode === "create") {
        await createAdminAsync(payload);
        toast.success("Admin created successfully!");
      } else if (admin) {
        await updateAdminAsync({ id: admin.id, data: payload });
        toast.success("Admin updated successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} admin`,
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <>
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Add New Admin" : "Edit Admin"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Create a new customer/admin account"
            : "Update admin information"}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="John Doe"
            className="mt-1"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email (Optional)</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@example.com"
            className="mt-1"
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Admin can use email or phone to login
          </p>
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+251911234567"
            className="mt-1"
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
          )}
          {mode === "create" && (
            <p className="text-xs text-gray-500 mt-1">
              Admin will receive login credentials via SMS
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={closeModal}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Updating..."}
              </>
            ) : mode === "create" ? (
              "Create Admin"
            ) : (
              "Update Admin"
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
