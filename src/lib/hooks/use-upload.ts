// lib/hooks/use-upload.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "../api/upload";

export function useUpload() {
  const uploadImageMutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadImage(file),
  });

  const uploadImagesMutation = useMutation({
    mutationFn: (files: File[]) => uploadApi.uploadImages(files),
  });

  return {
    uploadImage: uploadImageMutation.mutate,
    uploadImageAsync: uploadImageMutation.mutateAsync,
    isUploadingImage: uploadImageMutation.isPending,
    uploadImageError: uploadImageMutation.error,

    uploadImages: uploadImagesMutation.mutate,
    uploadImagesAsync: uploadImagesMutation.mutateAsync,
    isUploadingImages: uploadImagesMutation.isPending,
    uploadImagesError: uploadImagesMutation.error,
  };
}
