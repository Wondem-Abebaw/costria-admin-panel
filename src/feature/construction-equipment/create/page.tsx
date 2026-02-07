// app/admin/construction-equipment/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { UserSelector } from "@/components/admin/user-selector";
import { User } from "@/lib/types/admin";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ConstructionEquipmentListingForm } from "../construction-listing-form";


export default function CreateConstructionEquipmentPage() {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (userId: string, user: User) => {
    setSelectedUser(user);
    // Update form store with user details
    const {
      useEquipmentFormStore,
    } = require("@/lib/store/construction-form-store");
    const store = useEquipmentFormStore.getState();
    store.setFormData({
      contactName: user.name,
      contactPhone: user.phone || "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/construction-equipment">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">
            Add Construction Equipment Listing
          </h1>
          <p className="text-gray-600">
            Create a new construction equipment rental listing for a user
          </p>
        </div>
      </div>

      {/* User Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Equipment Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>User (Owner)</Label>
              <UserSelector
                value={selectedUser?.id}
                onValueChange={handleUserSelect}
              />
              <p className="text-sm text-gray-500 mt-1">
                Select the user who owns this equipment
              </p>
            </div>

            {selectedUser && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Selected User Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>{" "}
                    {selectedUser.name}
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>{" "}
                    {selectedUser.email}
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>{" "}
                    {selectedUser.phone || "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Construction Equipment Form */}
      {selectedUser && (
        <ConstructionEquipmentListingForm
          mode="create"
    
          selectedUserId={selectedUser.id}
        />
      )}

      {!selectedUser && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">
              Please select a user to continue creating the listing
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
