import axios from 'axios';
import type { ApiError } from '@/types/api';

export function extractApiErrorMessage(error: Error): string {
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as ApiError;
    if (data?.message) return data.message;
  }
  return error.message || 'An unexpected error occurred.';
}
