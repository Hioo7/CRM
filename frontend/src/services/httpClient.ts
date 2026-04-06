import axios from 'axios';
import { API_BASE_URL, AUTH_TOKEN_KEY } from '@/config/constants';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default httpClient;
