// lib/validations/vehicle-listing-schema.ts
import { z } from "zod";

export const vehicleListingSchema = z.object({
  // Top-level fields
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  
  subCategory: z.enum(["cars", "trucks", "limousine", "vans"], {
    required_error: "Vehicle type is required",
  }),
  
  price: z
    .number({
      required_error: "Price is required",
      invalid_type_error: "Price must be a number",
    })
    .min(1, "Price must be greater than 0"),
  
  rentalUnit: z.enum(["hour", "day", "week", "month"], {
    required_error: "Rental unit is required",
  }),
  
  negotiable: z.boolean().default(false),

  // Location & Contact
  city: z.string().min(1, "City is required"),
  
  location: z.string().min(1, "Location is required"),
  
  description: z.string().optional(),
  
  listedBy: z.enum(["Owner", "Agent", "Company"], {
    required_error: "Listed by is required",
  }),
  
  contactName: z.string().min(1, "Contact name is required"),
  
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),

  // Vehicle Attributes
  brand: z.string().min(1, "Brand is required"),
  
  model: z.string().optional(),
  
  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .min(1990, "Year must be 1990 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  
  condition: z.enum(["New", "Used", "Reconditioned"], {
    required_error: "Condition is required",
  }),
  
  fuelType: z.enum(["Petrol", "Diesel", "Electric", "Hybrid"], {
    required_error: "Fuel type is required",
  }),
  
  transmission: z.enum(["Automatic", "Manual", "CVT", "AMT"], {
    required_error: "Transmission is required",
  }),
});

export type VehicleListingFormData = z.infer<typeof vehicleListingSchema>;