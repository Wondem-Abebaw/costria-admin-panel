// app/admin/page.tsx
"use client";
import { useSession } from "next-auth/react";

export default function AdminDashboard() {
  const { data: session, status } = useSession();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Welcome to Costria Admin Panel</p>
        <div>welcome {session?.user.name}</div>
      </div>
    </div>
  );
}
