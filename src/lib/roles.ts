// ============================================
// 6. ROLE UTILITIES
// ============================================

// lib/utils/roles.ts
import { UserRole } from "@/lib/types/admin";

export function canAccessRoute(
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false;

  const roleHierarchy = {
    [UserRole.CUSTOMER]: 0,
    [UserRole.ADMIN]: 1,
    [UserRole.SUPER_ADMIN]: 2,
  };

  return (roleHierarchy[userRole] || 0) >= roleHierarchy[requiredRole];
}

export function getRoleBadgeColor(role: UserRole): string {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return "bg-purple-100 text-purple-800";
    case UserRole.ADMIN:
      return "bg-blue-100 text-blue-800";
    case UserRole.CUSTOMER:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function getRoleDisplayName(role: UserRole): string {
  return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
}