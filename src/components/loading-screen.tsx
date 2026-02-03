// components/ui/loading-screen.tsx
import { Loader2 } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
      <p className="text-gray-600">Loading...</p>
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex justify-center items-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}
