import httpClient from './httpClient';
import type { Employee } from '@/types/auth';
import type { UpdateSelfPayload } from '@/types/employee';

export const meService = {
  async getProfile(): Promise<Employee> {
    const { data } = await httpClient.get<Employee>('/me');
    return data;
  },

  async updateProfile(payload: UpdateSelfPayload): Promise<Employee> {
    const { data } = await httpClient.patch<Employee>('/me', payload);
    return data;
  },
};
