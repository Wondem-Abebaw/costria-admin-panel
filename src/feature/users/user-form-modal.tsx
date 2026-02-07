// app/admin/users/user-form-modal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser } from "@/lib/hooks/use-users";
import { useQueryClient } from "@tanstack/react-query";

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

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: string;
  name: string;
  email?: string;
  phone: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User | null;
  mode: "create" | "edit";
}

export function UserFormModal({ open, onOpenChange, user, mode }: Props) {
  const queryClient = useQueryClient();
  const { createUserAsync, isCreating } = useCreateUser();
  const { updateUserAsync, isUpdating } = useUpdateUser();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
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
    if (mode === "edit" && user) {
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phone", user.phone || "");
    } else {
      reset();
    }
  }, [mode, user, setValue, reset]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => reset(), 200);
    }
  }, [open, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        ...(data.email && { email: data.email }),
      };

      if (mode === "create") {
        await createUserAsync(payload);
        toast.success("User created successfully!");
      } else if (user) {
        await updateUserAsync({ id: user.id, data: payload });
        toast.success("User updated successfully!");
      }

      queryClient.invalidateQueries({ queryKey: ["users"] });
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} user`,
      );
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New User" : "Edit User"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Create a new customer/user account"
              : "Update user information"}
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
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              User can use email or phone to login
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
              <p className="text-sm text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
            {mode === "create" && (
              <p className="text-xs text-gray-500 mt-1">
                User will receive login credentials via SMS
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
                "Create User"
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
