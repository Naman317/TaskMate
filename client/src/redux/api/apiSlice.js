import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800/api";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_URI,
    prepareHeaders: (headers) => {
      // Credentials (cookies) are handled by browser/axios configuration
      // but if we were using tokens, we'd add them here.
      return headers;
    },
  }),
  tagTypes: ["Task", "User", "Notification"],
  endpoints: (builder) => ({}),
});
