import axios from "axios";
import { encryptToken, clearToken, decryptToken } from "@/utils/protect";
import { useRouter } from "next/navigation";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LENDING_SERVICE_URL,
  timeout: 600000, // Set a timeout for requests
  headers: {
    "x-api-key": `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`,
  },
});

// Request interceptor to attach the token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await decryptToken(); // Decrypt the current token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Failed to decrypt token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response; // If the response is successful, return it.
  },
  async (error) => {
    // Check if the error is due to an expired token
    if (error.response?.status === 401 && (error.response?.data?.message === "unauthorized" || error.response?.data?.message === "Unauthenticated.")) {
      try {
        const refreshToken = localStorage.getItem("admin_refresh_token");
        if (!refreshToken) {
          clearToken();

          // Redirect to login if no refresh token is available
          window.location.href = '/';
          return Promise.reject(error); // Exit the flow
        }

        // Request a new access token
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_LENDING_SERVICE_URL}/auth/admin/refresh`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "x-api-key": `${process.env.NEXT_PUBLIC_LENDING_SERVICE_API_KEY}`,
              
            },
          }
        );


        // Encrypt and store the new access token
        const newAccessToken = res.data.data.access_token;
        await encryptToken(newAccessToken);

        // Retry the original request with the new token
        const originalRequest = error.config;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token. Logging out...",error);
        clearToken();
        window.location.href = '/';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;