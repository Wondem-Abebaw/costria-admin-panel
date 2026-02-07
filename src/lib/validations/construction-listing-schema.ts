// lib/validations/equipment-listing-schema.ts
import { z } from "zod";

export const equipmentListingSchema = z.object({
  // Top-level fields
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),

  subCategory: z.string(
  
    {
      required_error: "Equipment type is required",
    }
  ),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(1, "Price must be greater than 0"),

  rentalUnit: z.string( {
    required_error: "Rental unit is required",
  }),

  negotiable: z.boolean().default(false),

  // Location & Contact
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  listedBy: z.string( {
    required_error: "Listed by is required",
  }),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),

  // Vehicle-type machinery attributes (conditional)
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  condition: z.string().optional(),
  fuelType: z.string().optional(),

  // Equipment specs
  operatingWeight: z.string().optional(),
  bucketCapacity: z.string().optional(),
  enginePower: z.string().optional(),
  maxHeight: z.string().optional(),
  maxLoad: z.string().optional(),
  dimensions: z.string().optional(),
});

export type EquipmentListingFormData = z.infer<typeof equipmentListingSchema>;