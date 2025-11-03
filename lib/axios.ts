// lib/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

// Konstanta untuk nama cookie token
const TOKEN_COOKIE_NAME = 'auth_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// Base URL dari environment variable
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Otomatis attach token dari cookie
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ambil token dari cookie
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    
    // Jika token ada, tambahkan ke Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle error dan refresh token
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Jika error 401 (Unauthorized) dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Ambil refresh token dari cookie
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);

        if (refreshToken) {
          // Request token baru menggunakan refresh token
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;

          // Simpan token baru ke cookie
          Cookies.set(TOKEN_COOKIE_NAME, token, { 
            expires: 7, // 7 hari
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          if (newRefreshToken) {
            Cookies.set(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
              expires: 30, // 30 hari
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict'
            });
          }

          // Retry original request dengan token baru
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Jika refresh token gagal, clear cookies dan redirect ke login
        Cookies.remove(TOKEN_COOKIE_NAME);
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        
        // Redirect ke login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;