/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { signOut, useSession } from "next-auth/react";

import EventEmitter from "events";
import { toast } from "sonner";
import { useGetHeaders } from "../hooks/use-get-headers";

export const sessionEventEmitter = new EventEmitter();
interface Header extends AxiosRequestConfig {
  headers: {
    "Content-Type": string;
    Accept: string;
    Authorization: string;
  };
}
axios.interceptors.response.use(
  (response) => response,
  // {
  //   const newToken = response.headers["x_new_token"];
  //   if (newToken) {
  //     sessionEventEmitter.emit("sessionUpdated", newToken);
  //   }
  //   return response;
  // },
  (error) => {
    if (error.response.status === 403 || error.response.status === 401) {
      signOut();
    }
    return Promise.reject(error);
  },
);
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/";
export const useFetchData = (
  queryKey: (string | number | boolean | undefined | null | any)[],
  url: string,
  headers?: Header["headers"] | any,
  enabled?: boolean,
) => {
  const { status } = useSession();
  const header = useGetHeaders({});

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_URL}${url}`, {
          headers: headers ?? header,
        });

        return response.data;
      } catch (error: any) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        }
        if (error?.response?.data?.error) {
          toast.error(error?.response?.data?.error);
        }
      }
    },
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    retry: true,
    enabled: status === "authenticated" && enabled !== false,
  });
};
