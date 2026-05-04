import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const RAW_URL = import.meta.env.VITE_APP_BASE_URL;

const RAW_URI = "https://tasky-production-render.onrender.com";
const cleanURI = RAW_URI.replace(/\/+$/, "");
const API_URI = (cleanURI.endsWith("/api") ? cleanURI : `${cleanURI}/api`) + "/";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_URI,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      console.log(`[RTK Query Debug] Token in Storage: ${!!token}, User in Storage: ${!!user}`);
      if (token) {
        headers.set("x-access-token", token);
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),


  tagTypes: ["Task", "User", "Notification"],
  endpoints: (builder) => ({}),
});
