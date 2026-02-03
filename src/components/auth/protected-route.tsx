// components/auth/protected-route.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireSuperAdmin = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (!isAdmin) {
        router.push("/auth/unauthorized");
      } else if (requireSuperAdmin && !isSuperAdmin) {
        router.push("/auth/unauthorized");
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    requireSuperAdmin,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }

  return <>{children}</>;
}
