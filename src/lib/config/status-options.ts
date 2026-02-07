import { StatusOption } from "@/components/dialogs/update-status-dialog";

// Vehicle status options

export const ListingStatusOptions: StatusOption[] = [
     { value: "pending", label: "Pending", variant: "secondary" },
  { value: "available", label: "Available", variant: "default" },
  { value: "deactivated", label: "Deactivated", variant: "outline" },
  { value: "closed", label: "Closed", variant: "destructive" },
];




// Helper function to get badge variant based on status
export function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "available") return "default";
  if (status === "rented" || status === "booked") return "secondary";
  if (status === "closed" || status === "cancelled") return "destructive";
  return "outline";
}