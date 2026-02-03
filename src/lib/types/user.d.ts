// lib/types/api.ts

export interface LoginRequest {
  identifier: string; // Can be email or phone
  password: string;
}

export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: string;
  provider?: string;
  providerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
