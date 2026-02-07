// app/admin/construction-equipment/construction-equipment-listing-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useListings, useListing } from "@/lib/hooks/use-listings";
import { useUpload } from "@/lib/hooks/use-upload";
import { categoriesApi } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Loader2,
  Upload,
  X,
  Image as ImageIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ethiopianCitiesLocations } from "@/lib/constants/city-and-locations";
import Image from "next/image";
import { useEquipmentFormStore } from "@/lib/store/construction-form-store";

// Equipment categories with specific field configurations
const EQUIPMENT_SUBCATEGORIES = [
  {
    value: "excavators",
    label: "Excavators",
    isVehicleType: true,
    needsWeight: true,
    needsBucket: true,
  },
  {
    value: "loaders",
    label: "Loaders",
    isVehicleType: true,
    needsWeight: true,
    needsBucket: true,
  },
  {
    value: "rollers",
    label: "Rollers",
    isVehicleType: true,
    needsWeight: true,
  },
  {
    value: "mixers",
    label: "Concrete Mixers",
    isVehicleType: true,
    needsCapacity: true,
  },
  {
    value: "compactors",
    label: "Compactors",
    isVehicleType: true,
    needsWeight: true,
  },
  {
    value: "cranes",
    label: "Cranes",
    isVehicleType: true,
    needsHeight: true,
    needsLoad: true,
  },
  {
    value: "generators",
    label: "Generators",
    isVehicleType: false,
    needsPower: true,
  },
  {
    value: "scaffolding",
    label: "Scaffolding",
    isVehicleType: false,
    needsDimensions: true,
  },
  {
    value: "winch",
    label: "Winch",
    isVehicleType: false,
  },
  {
    value: "tools",
    label: "Power Tools",
    isVehicleType: false,
    needsPower: true,
  },
];

// Zod Validation Schema
const equipmentListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subCategory: z.string({
    required_error: "Equipment type is required",
  }),
  price: z.number().min(1, "Price must be greater than 0"),
  rentalUnit: z.string({
    required_error: "Rental unit is required",
  }),
  negotiable: z.boolean(),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
  listedBy: z.string({
    required_error: "Listed by is required",
  }),
  contactName: z.string().min(1, "Contact name is required"),
  contactPhone: z.string().min(1, "Contact phone is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.number().optional(),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  operatingWeight: z.string().optional(),
  bucketCapacity: z.string().optional(),
  enginePower: z.string().optional(),
  maxHeight: z.string().optional(),
  maxLoad: z.string().optional(),
  dimensions: z.string().optional(),
});

type EquipmentListingFormData = z.infer<typeof equipmentListingSchema>;

interface Props {
  mode: "create" | "edit";
  listingId?: string;
  // Admin props
  isAdmin?: boolean;
  selectedUserId?: string;
}

export function ConstructionEquipmentListingForm({
  mode,
  listingId,
  isAdmin = false,
  selectedUserId,
}: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: listing, isLoading: isLoadingListing } = useListing(
    mode === "edit" && listingId ? listingId : "",
  );
  const { reset, setEditMode, images, setImages, addImage, removeImage } =
    useEquipmentFormStore();
  const { createAsync, isCreating, updateAsync, isUpdating } = useListings();
  const { uploadImagesAsync, isUploadingImages } = useUpload();

  const [filterOptions, setFilterOptions] = useState<any>(null);
  const [uploadError, setUploadError] = useState("");
  const [imageError, setImageError] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const form = useForm<EquipmentListingFormData>({
    resolver: zodResolver(equipmentListingSchema),
    defaultValues: {
      title: "",
      subCategory: "excavators",
      price: 0,
      rentalUnit: "day",
      negotiable: false,
      city: "Addis Ababa",
      location: "",
      description: "",
      listedBy: "Owner",
      contactName: "",
      contactPhone: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      condition: "Used",
      fuelType: "Diesel",
      operatingWeight: "",
      bucketCapacity: "",
      enginePower: "",
      maxHeight: "",
      maxLoad: "",
      dimensions: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const selectedCity = ethiopianCitiesLocations.find(
    (city) => city.value === watch("city"),
  );

  const selectedSubCategory = watch("subCategory");
  const config = EQUIPMENT_SUBCATEGORIES.find(
    (s) => s.value === selectedSubCategory,
  );

  // Load filter options
  useEffect(() => {
    categoriesApi.getEquipmentFilters().then(setFilterOptions);
  }, []);

  // Set mode
  useEffect(() => {
    setEditMode(mode === "edit");

    return () => {
      if (mode === "create") {
        reset();
      }
    };
  }, [mode, setEditMode, reset]);

  // Populate form for create mode with user data
  useEffect(() => {
    if (mode === "create" && status === "authenticated" && !isAdmin) {
      setValue("contactName", session.user?.name || "");
      setValue("contactPhone", session.user?.phone || "");
    }
  }, [mode, status, session, setValue, isAdmin]);

  // Populate form for edit mode with listing data
  useEffect(() => {
    if (mode === "edit" && listing) {
      setValue("title", listing.title);
      setValue("subCategory", listing.subCategory);
      setValue("price", listing.price);
      setValue("rentalUnit", listing.rentalUnit);
      setValue("negotiable", listing.negotiable || false);
      setValue("city", listing.city);
      setValue("location", listing.location || "");
      setValue("description", listing.description || "");
      setValue("listedBy", listing.listedBy || "Owner");
      setValue("contactName", listing.contactName);
      setValue("contactPhone", listing.contactPhone);

      const attrs = listing.attributes || {};
      setValue("brand", attrs.brand || "");
      setValue("model", attrs.model || "");
      setValue("year", attrs.year || new Date().getFullYear());
      setValue("condition", attrs.condition || "Used");
      setValue("fuelType", attrs.fuelType || "Diesel");
      setValue("operatingWeight", attrs.operatingWeight || "");
      setValue("bucketCapacity", attrs.bucketCapacity || "");
      setValue("enginePower", attrs.enginePower || "");
      setValue("maxHeight", attrs.maxHeight || "");
      setValue("maxLoad", attrs.maxLoad || "");
      setValue("dimensions", attrs.dimensions || "");

      setImages(listing.images || []);
    }
  }, [mode, listing, setValue, setImages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setUploadError("Only image files are allowed");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Images must be less than 5MB");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadError("");
    setImageError("");

    try {
      const urls = await uploadImagesAsync(validFiles);
      urls.forEach((url) => addImage(url));
    } catch (err: any) {
      setUploadError(err?.response?.data?.message || "Failed to upload images");
    }
  };

  const onSubmit = async (data: EquipmentListingFormData) => {
    // Validate images
    if (images.length === 0) {
      setImageError("Please upload at least one image");
      document
        .getElementById("image-upload")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // For admin mode, validate user is selected
    if (isAdmin && mode === "create" && !selectedUserId) {
      toast.error("Please select a user for this listing");
      return;
    }

    setImageError("");

    // Only include vehicle-type fields if it's a vehicle-type equipment
    const attributes: any = {};

    if (config?.isVehicleType) {
      attributes.brand = data.brand;
      attributes.model = data.model;
      attributes.year = data.year;
      attributes.condition = data.condition;
      attributes.fuelType = data.fuelType;
    }

    // Add equipment-specific fields
    if (data.operatingWeight) attributes.operatingWeight = data.operatingWeight;
    if (data.bucketCapacity) attributes.bucketCapacity = data.bucketCapacity;
    if (data.enginePower) attributes.enginePower = data.enginePower;
    if (data.maxHeight) attributes.maxHeight = data.maxHeight;
    if (data.maxLoad) attributes.maxLoad = data.maxLoad;
    if (data.dimensions) attributes.dimensions = data.dimensions;

    const payload: any = {
      category: "construction-equipment",
      title: data.title,
      subCategory: data.subCategory,
      price: data.price,
      rentalUnit: data.rentalUnit,
      negotiable: data.negotiable,
      city: data.city,
      location: data.location,
      description: data.description,
      listedBy: data.listedBy,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      images: images,
      attributes: attributes,
    };

    // Add userId for admin mode
    if (isAdmin && selectedUserId) {
      payload.userId = selectedUserId;
    }

    try {
      if (mode === "create") {
        await createAsync(payload);
        toast.success("Your equipment listing has been created successfully!");
      } else {
        await updateAsync({
          id: listingId!,
          data: payload,
        });
        toast.success("Your equipment listing has been updated successfully!");
      }

      reset();
      // router.push("/construction-equipment");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} listing`,
      );
    }
  };

  // Loading states
  if (
    status === "loading" ||
    (mode === "edit" && isLoadingListing) ||
    !filterOptions
  ) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Listing not found
  if (mode === "edit" && !listing) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Listing not found</p>
      </div>
    );
  }

  const isSubmitting = mode === "create" ? isCreating : isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Equipment Details Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Equipment Details</h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., CAT 320 Excavator - Excellent Condition"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Equipment Type */}
            <div>
              <Label htmlFor="subCategory">
                Equipment Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("subCategory")}
                onValueChange={(value: any) => setValue("subCategory", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EQUIPMENT_SUBCATEGORIES.map((sub) => (
                    <SelectItem key={sub.value} value={sub.value}>
                      {sub.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subCategory && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.subCategory.message}
                </p>
              )}
            </div>

            {/* Conditional Vehicle-Type Fields */}
            {config?.isVehicleType && (
              <>
                {/* Brand */}
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Select
                    value={watch("brand")}
                    onValueChange={(value) => setValue("brand", value)}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.brands.map((brand: string) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model */}
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    {...register("model")}
                    placeholder="e.g., 320"
                    className="mt-1"
                  />
                </div>

                {/* Year */}
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    placeholder="2020"
                    className="mt-1"
                  />
                </div>

                {/* Condition */}
                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={watch("condition")}
                    onValueChange={(value: any) => setValue("condition", value)}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.conditions.map((condition: string) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type */}
                <div>
                  <Label htmlFor="fuelType">Fuel Type</Label>
                  <Select
                    value={watch("fuelType")}
                    onValueChange={(value: any) => setValue("fuelType", value)}
                  >
                    <SelectTrigger className="mt-1 w-full">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Conditional Spec Fields */}
            {config?.needsWeight && (
              <div>
                <Label htmlFor="operatingWeight">Operating Weight</Label>
                <Input
                  id="operatingWeight"
                  {...register("operatingWeight")}
                  placeholder="e.g., 20 tons"
                  className="mt-1"
                />
              </div>
            )}

            {config?.needsBucket && (
              <div>
                <Label htmlFor="bucketCapacity">Bucket Capacity</Label>
                <Input
                  id="bucketCapacity"
                  {...register("bucketCapacity")}
                  placeholder="e.g., 1.2 m³"
                  className="mt-1"
                />
              </div>
            )}

            {config?.needsHeight && (
              <div>
                <Label htmlFor="maxHeight">Maximum Height</Label>
                <Input
                  id="maxHeight"
                  {...register("maxHeight")}
                  placeholder="e.g., 50 meters"
                  className="mt-1"
                />
              </div>
            )}

            {config?.needsLoad && (
              <div>
                <Label htmlFor="maxLoad">Maximum Load</Label>
                <Input
                  id="maxLoad"
                  {...register("maxLoad")}
                  placeholder="e.g., 10 tons"
                  className="mt-1"
                />
              </div>
            )}

            {config?.needsDimensions && (
              <div>
                <Label htmlFor="dimensions">Dimensions</Label>
                <Input
                  id="dimensions"
                  {...register("dimensions")}
                  placeholder="e.g., 2m x 2m x 3m"
                  className="mt-1"
                />
              </div>
            )}

            {config?.needsPower && (
              <div>
                <Label htmlFor="enginePower">Power/Capacity</Label>
                <Input
                  id="enginePower"
                  {...register("enginePower")}
                  placeholder="e.g., 150 HP or 100 kVA"
                  className="mt-1"
                />
              </div>
            )}

            {/* Price */}
            <div>
              <Label htmlFor="price">
                Price (Birr) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="5000"
                className="mt-1"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Rental Unit */}
            <div>
              <Label htmlFor="rentalUnit">
                Rental Unit <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("rentalUnit")}
                onValueChange={(value: any) => setValue("rentalUnit", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="month">Per Month</SelectItem>
                </SelectContent>
              </Select>
              {errors.rentalUnit && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.rentalUnit.message}
                </p>
              )}
            </div>

            {/* Negotiable */}
            <div className="flex items-center gap-2 w-full">
              <Switch
                id="negotiable"
                checked={watch("negotiable")}
                onCheckedChange={(checked) => setValue("negotiable", checked)}
              />
              <Label htmlFor="negotiable">Price is negotiable</Label>
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your equipment..."
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Location & Contact Information Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">
          Location & Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* City */}
          <div>
            <Label htmlFor="city">
              City <span className="text-red-500">*</span>
            </Label>
            <Popover open={cityOpen} onOpenChange={setCityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cityOpen}
                  className="mt-1 w-full justify-between"
                >
                  {watch("city")
                    ? ethiopianCitiesLocations.find(
                        (city) => city.value === watch("city"),
                      )?.label
                    : "Select City"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search city..." />
                  <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                      {ethiopianCitiesLocations.map((city) => (
                        <CommandItem
                          key={city.value}
                          value={city.value}
                          onSelect={(currentValue) => {
                            setValue("city", currentValue);
                            setValue("location", "");
                            setCityOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              watch("city") === city.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {city.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.city && (
              <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">
              Location <span className="text-red-500">*</span>
            </Label>
            <Popover open={locationOpen} onOpenChange={setLocationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationOpen}
                  className="mt-1 w-full justify-between"
                  disabled={!selectedCity}
                >
                  {watch("location")
                    ? selectedCity?.locations.find(
                        (loc) => loc.value === watch("location"),
                      )?.label
                    : "Select Location"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search location..." />
                  <CommandList>
                    <CommandEmpty>No location found.</CommandEmpty>
                    <CommandGroup>
                      {selectedCity?.locations.map((location) => (
                        <CommandItem
                          key={location.value}
                          value={location.value}
                          onSelect={(currentValue) => {
                            setValue("location", currentValue);
                            setLocationOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              watch("location") === location.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {location.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {errors.location && (
              <p className="text-sm text-red-600 mt-1">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Contact Name */}
          <div>
            <Label htmlFor="contactName">
              Contact Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactName"
              {...register("contactName")}
              placeholder="John Doe"
              className="mt-1"
              disabled={isAdmin && mode === "create"}
            />
            {errors.contactName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contactName.message}
              </p>
            )}
            {isAdmin && mode === "create" && (
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled from selected user
              </p>
            )}
          </div>

          {/* Contact Phone */}
          <div>
            <Label htmlFor="contactPhone">
              Contact Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="contactPhone"
              {...register("contactPhone")}
              placeholder="+251911234567"
              className="mt-1"
              disabled={isAdmin && mode === "create"}
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contactPhone.message}
              </p>
            )}
            {isAdmin && mode === "create" && (
              <p className="text-xs text-gray-500 mt-1">
                Auto-filled from selected user
              </p>
            )}
          </div>

          {/* Listed By */}
          <div>
            <Label htmlFor="listedBy">
              Listed By <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("listedBy")}
              onValueChange={(value: any) => setValue("listedBy", value)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Owner">Owner</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
              </SelectContent>
            </Select>
            {errors.listedBy && (
              <p className="text-sm text-red-600 mt-1">
                {errors.listedBy.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Equipment Images</h3>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors mb-4">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploadingImages}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {isUploadingImages ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-3" />
                <p className="text-gray-600">Uploading images...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP up to 5MB. First image will be the main photo.
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">
              Uploaded Images ({images.length})
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={url} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Equipment image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  {index === 0 && (
                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                      Main Photo
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length === 0 && !isUploadingImages && (
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No images uploaded yet</p>
          </div>
        )}

        {uploadError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {imageError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{imageError}</AlertDescription>
          </Alert>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "create"
                ? "Creating Listing..."
                : "Updating Listing..."}
            </>
          ) : mode === "create" ? (
            "Create Listing"
          ) : (
            "Update Listing"
          )}
        </Button>
      </div>
    </form>
  );
}
