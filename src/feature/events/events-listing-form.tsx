// components/create/events/events-listing-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { useEventsFormStore } from "@/lib/store/events-form-store";
import { useListings, useListing } from "@/lib/hooks/use-listings";
import { useUpload } from "@/lib/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Video,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ethiopianCitiesLocations } from "@/lib/constants/city-and-locations";
import { EVENTSEUBCATEGORIES } from "@/lib/constants/event-subcategories";
import Image from "next/image";


// Bilingual lists
const CATERING_MATERIALS = [
  "Tent (ድንኳን)",
  "Decor (ዲኮር)",
  "Tables (ጠረጴዛ)",
  "Chairs (ወንበር)",
  "Plates (ሳህን)",
  "Glasses (ብርጭቆ)",
  "Cutlery (ማንኪያና ሹካ)",
  "Serving Dishes (የምግብ ማቅረቢያ)",
  "Tablecloths (የጠረጴዛ ልብስ)",
  "Napkins (ሴርቬት)",
  "Decorative Items (የማስጌጫ እቃዎች)",
  "Lighting (መብራት)",
  "Sound System (የድምፅ መሳሪያ)",
  "Stage (መድረክ)",
  "Carpet (ምንጣፍ)",
  "Generators (ጄነሬተር)",
  "Cooling Fans (ማራገቢያ)",
  "Heaters (ማሞቂያ)",
  "Buffet Tables (ቡፌ ጠረጴዛ)",
  "Food Warmers (የምግብ ማሞቂያ)",
  "Ice Boxes (የበረዶ ሳጥን)",
];

const PACKAGE_SERVICES = [
  "Decor (ዲኮር)",
  "Catering (መመገብ)",
  "Photography (ፎቶ)",
  "Videography (ቪዲዮ)",
  "DJ Services (ዲጄ)",
  "Live Band (ቀጥታ ሙዚቃ)",
  "MC Services (አስተናጋጅ)",
  "Car Decoration (የመኪና ማስጌጥ)",
  "Bridal Makeup (የሙሽሪት ሜካፕ)",
  "Hair Styling (የፀጉር አበጣጠር)",
  "Wedding Cake (የሠርግ ኬክ)",
  "Red Carpet (ቀይ ምንጣፍ)",
  "Security Services (የደህንነት አገልግሎት)",
  "Valet Parking (የመኪና ማቆሚያ አገልግሎት)",
  "Guest Coordination (እንግዳ አስተባባሪ)",
];

// Zod Validation Schema
const eventsListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subCategory: z.string({
    required_error: "Service type is required",
  }),
  eventsPrice: z.string().min(1, "Price is required"),
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
  videoUrl: z.string().optional(),
});

type EventsListingFormData = z.infer<typeof eventsListingSchema>;

interface Props {
  mode: "create" | "edit";
  listingId?: string;
  selectedUserId?: string;
}

export function EventsListingForm({ mode, listingId, selectedUserId }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: listing, isLoading: isLoadingListing } = useListing(
    mode === "edit" && listingId ? listingId : "",
  );
  const { reset, setEditMode, images, setImages, addImage, removeImage } =
    useEventsFormStore();
  const { createAsync, isCreating, updateAsync, isUpdating } = useListings();
  const { uploadImagesAsync, isUploadingImages } = useUpload();

  const [uploadError, setUploadError] = useState("");
  const [imageError, setImageError] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [tempVideoUrl, setTempVideoUrl] = useState("");

  const [videoError, setVideoError] = useState("");

  const form = useForm<EventsListingFormData>({
    resolver: zodResolver(eventsListingSchema),
    defaultValues: {
      title: "",
      subCategory: "cateringMaterials",
      eventsPrice: "",
      rentalUnit: "day",
      negotiable: false,
      city: "",
      location: "",
      description: "",
      listedBy: "Owner",
      contactName: "",
      contactPhone: "",
      videoUrl: "",
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
  const config = EVENTSEUBCATEGORIES.find(
    (s) => s.value === selectedSubCategory,
  );

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
    if (mode === "create" && status === "authenticated") {
      setValue("contactName", session.user?.name || "");
      setValue("contactPhone", session.user?.phone || "");
    }
  }, [mode, status, session, setValue]);

  // Populate form for edit mode with listing data
  useEffect(() => {
    if (mode === "edit" && listing) {
      setValue("title", listing.title);
      setValue("subCategory", listing.subCategory);
      setValue("eventsPrice", listing.eventsPrice || "");
      setValue("rentalUnit", listing.rentalUnit);
      setValue("negotiable", listing.negotiable || false);
      setValue("city", listing.city);
      setValue("location", listing.location || "");
      setValue("description", listing.description || "");
      setValue("listedBy", listing.listedBy || "Owner");
      setValue("contactName", listing.contactName);
      setValue("contactPhone", listing.contactPhone);
      setValue("videoUrl", listing.videoUrl || "");
      setTempVideoUrl(listing.videoUrl || "");
      setImages(listing.images || []);
      setSelectedMaterials(listing.attributes?.materials || []);
      setSelectedServices(listing.attributes?.servicesIncluded || []);
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

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material],
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const isValidVideoUrl = (url: string): boolean => {
    if (!url) return true;
    if (url.includes("youtube.com") || url.includes("youtu.be")) return true;
    if (url.includes("vimeo.com")) return true;
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSaveVideo = () => {
    if (tempVideoUrl && !isValidVideoUrl(tempVideoUrl)) {
      setVideoError("Please enter a valid YouTube, Vimeo, or video file URL");
      return;
    }

    setValue("videoUrl", tempVideoUrl);
    setVideoError("");
  };

  const handleRemoveVideo = () => {
    setTempVideoUrl("");
    setValue("videoUrl", "");
  };

  const getVideoPreview = (
    url: string,
  ): { type: "iframe" | "video" | "link"; src: string } | null => {
    if (!url) return null;

    // YouTube
    if (url.includes("youtube.com/watch")) {
      const id = url.split("v=")[1]?.split("&")[0];
      if (id) {
        return {
          type: "iframe",
          src: `https://www.youtube.com/embed/${id}`,
        };
      }
    }

    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) {
        return {
          type: "iframe",
          src: `https://www.youtube.com/embed/${id}`,
        };
      }
    }

    // Vimeo
    if (url.includes("vimeo.com/")) {
      const id = url.split("vimeo.com/")[1]?.split("?")[0];
      if (id) {
        return {
          type: "iframe",
          src: `https://player.vimeo.com/video/${id}`,
        };
      }
    }

    // TikTok
    if (url.includes("tiktok.com")) {
      const match = url.match(/\/video\/(\d+)/);
      if (match?.[1]) {
        return {
          type: "iframe",
          src: `https://www.tiktok.com/embed/v2/${match[1]}`,
        };
      }
    }

    // Direct video files
    if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
      return {
        type: "video",
        src: url,
      };
    }

    // Fallback: show link
    try {
      new URL(url);
      return {
        type: "link",
        src: url,
      };
    } catch {
      return null;
    }
  };
  const preview = getVideoPreview(watch("videoUrl") || "");

  const onSubmit = async (data: EventsListingFormData) => {
    if (images.length === 0) {
      setImageError("Please upload at least one image");
      document
        .getElementById("image-upload")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setImageError("");

    const payload = {
      category: "events",
      title: data.title,
      price: 0,
      subCategory: data.subCategory,
      eventsPrice: data.eventsPrice,
      rentalUnit: data.rentalUnit,
      negotiable: data.negotiable,
      city: data.city,
      location: data.location,
      description: data.description,
      listedBy: data.listedBy,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      images: images,
      videoUrl: data.videoUrl,
      attributes: {
        materials: selectedMaterials,
        servicesIncluded: selectedServices,
      },
    };

    try {
      if (mode === "create") {
        if (selectedUserId) {
          payload.userId = selectedUserId;
        }
        await createAsync(payload);
        toast.success(
          "Your event service listing has been created successfully!",
        );
      } else {
        await updateAsync({
          id: listingId!,
          data: payload,
        });
        toast.success(
          "Your event service listing has been updated successfully!",
        );
      }

      reset();
      router.push("/account/listings");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${mode === "create" ? "create" : "update"} listing`,
      );
    }
  };

  // Loading states
  if (status === "loading" || (mode === "edit" && isLoadingListing)) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">
          You need to be logged in to {mode} a listing.
        </p>
      </div>
    );
  }

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
      {/* Service Details Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold mb-4">Event Service Details</h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Complete Wedding Catering Service"
              className="mt-1"
            />
            {errors.title && (
              <p className="text-sm text-red-600 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Type */}
            <div>
              <Label htmlFor="subCategory">
                Service Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("subCategory")}
                onValueChange={(value: any) => setValue("subCategory", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENTSEUBCATEGORIES.map((sub) => (
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

            {/* Price */}
            <div>
              <Label htmlFor="eventsPrice">
                Price <span className="text-red-500">*</span>
              </Label>
              <Input
                id="eventsPrice"
                {...register("eventsPrice")}
                placeholder="50000 Birr or 'Depends on package'"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter amount in Birr or describe pricing (e.g., "Depends on
                package")
              </p>
              {errors.eventsPrice && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.eventsPrice.message}
                </p>
              )}
            </div>

            {/* Rental Unit */}
            <div>
              <Label htmlFor="rentalUnit">
                Rental Period <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("rentalUnit")}
                onValueChange={(value: any) => setValue("rentalUnit", value)}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Per Hour</SelectItem>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="week">Per Week</SelectItem>
                  <SelectItem value="event">Per Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Negotiable */}
            <div className="flex items-center gap-2">
              <Switch
                id="negotiable"
                checked={watch("negotiable")}
                onCheckedChange={(checked) => setValue("negotiable", checked)}
              />
              <Label htmlFor="negotiable">Price is negotiable</Label>
            </div>
          </div>

          {/* Category-specific fields */}
          {config?.needsMaterials && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3">
                Available Materials (የድግስ እቃዎች)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {CATERING_MATERIALS.map((material) => (
                  <div key={material} className="flex items-center space-x-2">
                    <Checkbox
                      id={material}
                      checked={selectedMaterials.includes(material)}
                      onCheckedChange={() => toggleMaterial(material)}
                    />
                    <label
                      htmlFor={material}
                      className="text-sm font-medium leading-none"
                    >
                      {material}
                    </label>
                  </div>
                ))}
              </div>

              {/* <div>
                <Label htmlFor="materialsAvailable">
                  Additional Materials Description
                </Label>
                <Textarea
                  id="materialsAvailable"
                  {...register("materialsAvailable")}
                  placeholder="Describe any additional materials..."
                  rows={3}
                  className="mt-1"
                />
              </div> */}
            </div>
          )}

          {config?.needsServices && (
            <div className="border-t pt-4 mt-4">
              <h4 className="font-semibold mb-3">
                Included Services (አገልግሎቶች)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PACKAGE_SERVICES.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={selectedServices.includes(service)}
                      onCheckedChange={() => toggleService(service)}
                    />
                    <label
                      htmlFor={service}
                      className="text-sm font-medium leading-none"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe your event service..."
              rows={4}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Location & Contact Section */}
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
            />
            {errors.contactName && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contactName.message}
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
            />
            {errors.contactPhone && (
              <p className="text-sm text-red-600 mt-1">
                {errors.contactPhone.message}
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
        <h3 className="text-lg font-semibold mb-4"> Images</h3>

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
                    alt={`Vehicle image ${index + 1}`}
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
        <div className="">
          {/* Video Section */}
          <div className="bg-white rounded-lg border p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {mode === "edit" ? "Update Video" : "Add Video"} (Optional)
              </h3>
              <p className="text-gray-600 text-sm">
                Add a video showcasing your service, venue, or event setup
              </p>
            </div>

            {videoError && (
              <Alert variant="destructive">
                <AlertDescription>{videoError}</AlertDescription>
              </Alert>
            )}

            {/* Input */}
            <div>
              <Label htmlFor="videoUrl">Video Link</Label>
              <p className="text-xs text-gray-500 mb-2">
                YouTube, Vimeo, or direct video link supported
              </p>

              <div className="flex gap-2">
                <Input
                  id="videoUrl"
                  value={tempVideoUrl}
                  onChange={(e) => {
                    setTempVideoUrl(e.target.value);
                    setVideoError("");
                  }}
                  placeholder="https://www.youtube.com/watch?v=..."
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSaveVideo}
                >
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {preview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Video Preview</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveVideo}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  {preview.type === "iframe" && (
                    <iframe
                      src={preview.src}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  )}

                  {preview.type === "video" && (
                    <video
                      src={preview.src}
                      controls
                      className="w-full h-full"
                    />
                  )}

                  {preview.type === "link" && (
                    <div className="flex items-center justify-center h-full text-white">
                      <a
                        href={preview.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Open video
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">No video added yet</p>
                <p className="text-gray-500 text-sm">
                  Paste any video link (YouTube, TikTok, Instagram, direct file,
                  etc.)
                </p>
              </div>
            )}
          </div>
        </div>
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
