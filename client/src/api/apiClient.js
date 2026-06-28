import axios from "axios";

const apiClient = axios.create({
  baseURL: "",
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    console.log(`[Axios Outgoing] ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
      headers: config.headers,
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("[Axios Outgoing Error]", error);
    return Promise.reject(error);
  }
);

export default apiClient;
