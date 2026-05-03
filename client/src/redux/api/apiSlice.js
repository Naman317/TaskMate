import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const RAW_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5055";
const cleanURI = RAW_URI.replace(/\/+$/, "");
const API_URI = (cleanURI.endsWith("/api") ? cleanURI : `${cleanURI}/api`) + "/";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URI,
    prepareHeaders: (headers) => {

      return headers;
    },
    credentials: "include",
  }),


  tagTypes: ["Task", "User", "Notification"],
  endpoints: (builder) => ({}),
});
