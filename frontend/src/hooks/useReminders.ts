import { useContext } from 'react';
import { ReminderContext } from '@/contexts/ReminderContext';

export function useReminders() {
  const ctx = useContext(ReminderContext);
  if (!ctx) {
    throw new Error('useReminders must be used within ReminderProvider');
  }
  return ctx;
}
