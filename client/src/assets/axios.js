import axios from "axios";

const API = axios.create({
  baseURL:"https://tasky-j89h.onrender.com/api"|| "http://localhost:5055/api",
  withCredentials: true,
});

export default API;
