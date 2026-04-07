import httpClient from './httpClient';
import type { ReminderListItem, CreateReminderPayload } from '@/types/reminder';

interface ListRemindersParams {
  completed?: 'true' | 'false';
  opportunityId?: string;
}

export const reminderService = {
  async list(params?: ListRemindersParams): Promise<ReminderListItem[]> {
    const { data } = await httpClient.get<ReminderListItem[]>('/reminders', { params });
    return data;
  },

  async create(payload: CreateReminderPayload): Promise<ReminderListItem> {
    const { data } = await httpClient.post<ReminderListItem>('/reminders', payload);
    return data;
  },

  async getById(id: string): Promise<ReminderListItem> {
    const { data } = await httpClient.get<ReminderListItem>(`/reminders/${id}`);
    return data;
  },

  async markComplete(id: string): Promise<ReminderListItem> {
    const { data } = await httpClient.patch<ReminderListItem>(`/reminders/${id}/complete`, {});
    return data;
  },
};
