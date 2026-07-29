
import axios from "axios";
import { LS_KEYS } from "../utils/constants";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* Request Interceptor: Attach Auth Token if present */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(LS_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* Response Interceptor: Catch 401 Unauthorized (JWT Expiry / Revoked Token) */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token & user from localStorage immediately
      localStorage.removeItem(LS_KEYS.TOKEN);
      localStorage.removeItem(LS_KEYS.USER);

      // Force redirect to login page if not already there
      if (window.location.pathname !== "/login") {
        window.location.href = "/login?session=expired";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
