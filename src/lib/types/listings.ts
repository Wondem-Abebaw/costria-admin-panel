// lib/types/listings.ts
export interface Listing {
  id: string;

  category: string;
  city: string;
  location?: string;
  description?: string;
  status: string;
  listedBy?: string;
  contactName: string;
  contactPhone: string;
  images: string[];
  contactViews: number;
    title: string;
  subCategory: string;
  price: number;

  rentalUnit: "hour" | "day" | "week" | "month" | "year";
  negotiable: boolean;
  attributes: ListingAttributes;
  userId?: string;
  user?: {
    id: string;
    name: string;
    phone?: string;
  };
  videoUrl?: string;
    eventsPrice?: string;
  postedDate: string;
  createdAt: string;
  updatedAt: string;
}



export interface ListingAttributes {
  // Common fields (required for all)


  // Vehicle-specific fields
  brand?: string;
  model?: string;
  year?: number;
  condition?: string;
  mileageKm?: number;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  engineCapacityCc?: number;
  color?: string;
  seatingCapacity?: number;

  // Equipment-specific fields
  operatingWeight?: string;
  bucketCapacity?: string;
  enginePower?: string;
  maxHeight?: string;
  maxLoad?: string;
  dimensions?: string;

  // Property fields (both commercial & residential)
  area?: number; // in square meters
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  furnished?: boolean;
  parking?: boolean;
  parkingSpaces?: number;

  // Residential-specific fields
  propertyType?: "Duplex" | "Triplex" | "Single Story" | "Multi Story";
  balcony?: boolean;
  balconies?: number;
  terrace?: boolean;
  garden?: boolean;
  
  // Furnishing
  furnishingLevel?: "Fully Furnished" | "Semi Furnished" | "Unfurnished";
  
  // Kitchen & Appliances
  kitchen?: boolean;
  kitchenType?: "Open Kitchen" | "Closed Kitchen" | "Kitchenette";
  refrigerator?: boolean;
  stove?: boolean;
  oven?: boolean;
  microwave?: boolean;
  dishwasher?: boolean;
  washingMachine?: boolean;
  
  // Climate Control
  airConditioning?: boolean;
  heatingSystem?: boolean;
  
  // Utilities
  internetIncluded?: boolean;
  cableTV?: boolean;
  waterSupply?: boolean;
  hotWater?: boolean;
  electricity24h?: boolean;
  generator?: boolean;
  
  // Security & Access
  securitySystem?: boolean;
  gatedCommunity?: boolean;
  doorman?: boolean;
  intercom?: boolean;
  
  // Parking
  parkingType?: "Covered" | "Open" | "Underground";
  storage?: boolean;
  
  // Building Amenities
  elevator?: boolean;
  gym?: boolean;
  swimmingPool?: boolean;
  playgroundArea?: boolean;
  
  // Policies
  petsAllowed?: boolean;
  smokingAllowed?: boolean;
  
  // Commercial property specific
  offices?: number;
  meetingRooms?: number;
  kitchenette?: boolean;
  receptionArea?: boolean;
  
  // Warehouse/Storage specific
  loadingDock?: boolean;
  ceilingHeight?: number;
  storageType?: "Climate Controlled" | "Regular" | "Cold Storage";
  
  // Retail specific
  frontage?: number;
  displayWindows?: number;
  
  // Additional arrays
  features?: string[];
  nearbyAmenities?: string[];

  // Venue fields
  capacity?: number;
  indoorSpace?: number;
  outdoorSpace?: number;

  // Event equipment fields
  includes?: string[];
  //events related
  servicesIncluded?: string[];
  materials?: string[];
  hallCapacity?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateListingRequest {
  category: string;
  city: string;
  location?: string;
  description?: string;
  listedBy?: string
  contactName: string;
  contactPhone: string;
  images?: string[];

  userId: string;
  attributes: ListingAttributes;
}

export interface UpdateListingRequest {
  city?: string;
  location?: string;
  description?: string;
  listedBy?: string
  contactName?: string;
  contactPhone?: string;
  images?: string[];
  attributes?: Partial<ListingAttributes>;
}

export interface SearchListingParams {
  category?: string;
  city?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  query?: string;
  attributeFilters?: Record<string, any>;
  page?: number;
  limit?: number;
  sortBy?: "postedDate" | "price" | "contactViews";
  sortOrder?: "ASC" | "DESC";
  status?: string;
}
