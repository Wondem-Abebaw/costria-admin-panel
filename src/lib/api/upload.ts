// lib/api/upload.ts
import { apiClient } from "./client";

export const uploadApi = {
  // Upload single image
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiClient.post<{ url: string }>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.url;
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const { data } = await apiClient.post<{ urls: string[] }>(
      "/upload/images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data.urls;
  },
};
