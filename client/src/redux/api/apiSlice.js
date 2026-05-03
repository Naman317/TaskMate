import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logoutUser } from "../redux/slices/authSlice";

const RAW_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:8800/api";
const API_URI = RAW_URI.endsWith("/api") ? RAW_URI : `${RAW_URI}/api`;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  credentials: "include",
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    api.dispatch(logoutUser());
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Task", "User", "Notification"],
  endpoints: (builder) => ({}),
});