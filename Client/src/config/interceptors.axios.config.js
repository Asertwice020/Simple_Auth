import { refreshAccessToken } from "../utils/tokenHandler";

const setupInterceptors = (axiosInstance) => {
  // * Request handler
  axiosInstance.interceptors.request.use(
    (config) => config, // Add headers/modify requests here
    (error) => {
      Promise.reject(error)
    }
  );

  // * Response handler
  axiosInstance.interceptors.response.use(
    (response) => response, // Modify responses here
    async (error) => {
      const originalRequest = error.config;

      // * Skip non-401 errors or retried requests
      if (error.response?.status !== 401 || originalRequest._retry) {
        console.log(`i am skipping non-401 errors or retried requests`)
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      
      try {
        await refreshAccessToken();  // Try token refresh
        return axiosInstance(originalRequest);  // Re-run original request
      } catch {
        return Promise.reject(error);  // Pass through original error on refresh failure
      }
    }
  );
};

export { setupInterceptors }