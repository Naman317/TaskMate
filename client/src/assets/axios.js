import axios from "axios";
import store from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

const RAW_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5055";
const cleanURI = RAW_URI.replace(/\/+$/, "");
const API_URI = (cleanURI.endsWith("/api") ? cleanURI : `${cleanURI}/api`) + "/";

const API = axios.create({
  baseURL: API_URI,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logoutUser());
    }
    return Promise.reject(error);
  }
);

export default API;

