import httpClient from './httpClient';
import type { AdminOverview, ActivityEntry } from '@/types/admin';

export const adminService = {
  async getOverview(): Promise<AdminOverview> {
    const { data } = await httpClient.get<AdminOverview>('/admin/overview');
    return data;
  },

  async getRecentActivity(): Promise<ActivityEntry[]> {
    const { data } = await httpClient.get<ActivityEntry[]>('/admin/activity');
    return data;
  },

  async getEmployeeActivity(employeeId: string): Promise<ActivityEntry[]> {
    const { data } = await httpClient.get<ActivityEntry[]>(
      `/admin/employees/${employeeId}/activity`,
    );
    return data;
  },
};
