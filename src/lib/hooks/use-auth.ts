// lib/hooks/use-auth.ts
import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    session,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "admin" || session?.user?.role === "super_admin",
    isSuperAdmin: session?.user?.role === "super_admin",
  };
}