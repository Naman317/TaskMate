import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const RAW_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800/api";
const API_URI = RAW_URI.endsWith("/api") ? RAW_URI : `${RAW_URI}/api`;

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
