import httpClient from './httpClient';
import type { LoginPayload, LoginResponse } from '@/types/auth';

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },
};
