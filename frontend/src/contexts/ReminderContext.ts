import { createContext } from 'react';
import type { ReminderListItem, CreateReminderPayload } from '@/types/reminder';

export interface ReminderContextValue {
  reminders: ReminderListItem[];
  isLoading: boolean;
  error: string | null;
  showCompleted: boolean;
  notificationPermission: NotificationPermission | 'unsupported';
  setShowCompleted: (value: boolean) => void;
  fetchReminders: () => Promise<void>;
  createReminder: (payload: CreateReminderPayload) => Promise<ReminderListItem>;
  markComplete: (id: string) => Promise<void>;
  requestNotificationPermission: () => Promise<NotificationPermission | 'unsupported'>;
}

export const ReminderContext = createContext<ReminderContextValue | null>(null);
