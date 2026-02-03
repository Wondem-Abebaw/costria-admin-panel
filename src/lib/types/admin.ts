// lib/types/admin.ts
export enum UserRole {
  CUSTOMER = "customer",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  provider?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
}

export interface AdminStats {
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  totalRevenue: number;
  listingsByCategory: { category: string; count: number }[];
  listingsByCity: { city: string; count: number }[];
  recentListings: any[];
}