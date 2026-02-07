// app/admin/events/edit/[id]/page.tsx
"use client";

import { useListing } from "@/lib/hooks/use-listings";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EventsListingForm } from "../events-listing-form";


type Props = {
  params: { id: string };
};

export default function EditEventsPage({ params }: Props) {
  const { data: listing, isLoading } = useListing(params.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Event service listing not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/events">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Event Service Listing</h1>
          <p className="text-gray-600">{listing.title}</p>
        </div>
      </div>

      <EventsListingForm mode="edit" listingId={params.id}  />
    </div>
  );
}
