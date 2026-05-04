import axios from "axios";
import store from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

const RAW_URI = "https://tasky-production-render.onrender.com";
const cleanURI = RAW_URI.replace(/\/+$/, "");
const API_URI = (cleanURI.endsWith("/api") ? cleanURI : `${cleanURI}/api`) + "/";

const API = axios.create({
  baseURL: API_URI,
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  console.log(`[Axios Debug] URL: ${config.url}, Token in Storage: ${!!token}, User in Storage: ${!!user}`);
  if (token) {
    config.headers["x-access-token"] = token;
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

