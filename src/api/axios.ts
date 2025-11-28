import axios, { AxiosError } from 'axios';
import { toastSuccess, toastError, toastApi422 } from '@/utils/toast';

const baseURL = import.meta.env.VITE_API_URL as string;

export const api = axios.create({
  baseURL,
});

api.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toUpperCase();
    if (method && ['POST', 'PUT', 'DELETE'].includes(method)) {
      toastSuccess('Operation completed successfully');
    }
    return response;
  },
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    if (status === 422) {
      const data = error.response?.data;
      toastApi422(data);
    } else {
      const message = (error.response?.data as any)?.message || error.message || 'Request error';
      toastError(message);
    }
    return Promise.reject(error);
  },
);

export default api;
