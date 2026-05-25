import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
});

api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("currentUser");
  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (parsed && parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error("Error parsing user for auth token", e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;