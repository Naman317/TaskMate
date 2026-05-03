import axios from "axios";
import store from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

const RAW_URI = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5055";
const API_URI = (RAW_URI.endsWith("/") ? RAW_URI : `${RAW_URI}/`) + (RAW_URI.includes("/api") ? "" : "api/");

const API = axios.create({
  baseURL: API_URI,
  withCredentials: true,
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

