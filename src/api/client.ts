import axios from 'axios';

import { useAuthStore } from '@/shared/store/auth.store';
import { type ApiError, TypedApiError } from '@/types/api-error';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let messages = ['Something went wrong'];
    let statusCode = 500;

    if (axios.isAxiosError<ApiError>(error)) {
      const data = error.response?.data;

      if (data?.message) {
        messages = Array.isArray(data.message) ? data.message : [data.message];
      }

      if (error.response?.status) {
        statusCode = error.response.status;
      }
    }

    return Promise.reject(new TypedApiError(messages, statusCode, error));
  },
);
