"use client";

import { useMutation } from "@tanstack/react-query";
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from "axios";
import { toast } from "sonner";
import { useGetHeaders } from "../hooks/use-get-headers";

type MutationOptions = {
  url: string;
  method: AxiosRequestConfig["method"];
  body?: any;
  headers?: AxiosRequestConfig["headers"];
  onSuccess?: (data: AxiosResponse["data"]) => void;
  onError?: (error: any) => void;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
};

// Define API_URL outside the hook so it's consistent
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";

const useDynamicMutation = ({
  type = "Json",
}: {
  type?: "FormData" | "Json";
}) => {
  const header = useGetHeaders({ type });

  const dynamicMutation = useMutation({
    mutationFn: async (options: MutationOptions) => {
      const {
        url,
        method,
        body,
        headers,
        onUploadProgress,
        onDownloadProgress,
      } = options;

      console.log("🚀 ~ Full URL:", `${API_URL}${url}`);

      try {
        const response = await axios.request({
          url: `${API_URL}${url}`, // Now uses the API_URL constant
          method,
          headers: headers || header,
          data: body,
          onUploadProgress,
          onDownloadProgress,
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      if (variables.onSuccess) {
        variables.onSuccess(data);
      }
    },
    onError: (error, variables) => {
      if (variables.onError) {
        variables.onError(error);
      }

      const errorData = (error as any)?.response?.data?.error;
      const errorMessage = (error as any)?.response?.data?.message;

      if (typeof errorData === "string") {
        toast.error(errorData);
      } else if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    },
    retry: false,
  });

  return dynamicMutation;
};

export default useDynamicMutation;
