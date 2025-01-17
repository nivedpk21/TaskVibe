import axios from "axios";
import { clearAuthData } from "./auth";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// you can also add a request interceptor to attach the token here

// response interceptor: handle token expiry

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      //token is expired
      clearAuthData();
      alert("Your session has expired. Please log in again.");
      window.location.href = "/signin"; //redirect to login page
    }
    return Promise.reject(error); // return error to api call
  }
);

export default axiosInstance;
