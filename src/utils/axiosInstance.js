// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // Optionally add other default configs like base URL
  withCredentials: true,
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
