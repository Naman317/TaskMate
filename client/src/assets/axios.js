import axios from "axios";
import store from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

const API_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:5000";


const API = axios.create({
  baseURL: `${API_URL}/api`,
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

