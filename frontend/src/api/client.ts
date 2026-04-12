import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:8081/api",
});

// A request interceptor automatically attaches the JWT token to EVERYTHING you send.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const url = config.url || "";
    const isAuthEndpoint =
      url.includes("/auth/login") || url.includes("/auth/register");

    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
