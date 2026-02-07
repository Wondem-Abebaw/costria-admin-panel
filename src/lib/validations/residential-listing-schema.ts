// lib/validations/residential-listing-schema.ts
import { z } from "zod";

export const residentialListingSchema = z.object({
  // Top-level fields
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),

  subCategory: z.string(
  
    {
      required_error: "Property type is required",
    }
  ),

  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(1, "Price must be greater than 0"),

  rentalUnit: z.string( {
    required_error: "Rental period is required",
  }),

  negotiable: z.boolean().default(false),

  // Location & Contact
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  listedBy: z.string({
    required_error: "Listed by is required",
  }),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),

  
  
});

export type ResidentialListingFormData = z.infer<typeof residentialListingSchema>;