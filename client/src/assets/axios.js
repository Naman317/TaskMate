import axios from "axios";

const API = axios.create({
  baseURL:"https://tasky-j89h.onrender.com/api",
  withCredentials: true,
});

export default API;
