import { useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { ReminderContext } from '@/contexts/ReminderContext';
import { reminderService } from '@/services/reminderService';
import { extractApiErrorMessage } from '@/utils/errors';
import type { ReminderListItem, CreateReminderPayload } from '@/types/reminder';

interface ReminderProviderProps {
  children: ReactNode;
}

const POLL_INTERVAL_MS = 60_000;

export function ReminderProvider({ children }: ReminderProviderProps) {
  const [reminders, setReminders] = useState<ReminderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'unsupported',
  );

  const firedRef = useRef<Set<string>>(new Set());
  const pendingRemindersRef = useRef<ReminderListItem[]>([]);

  useEffect(() => {
    pendingRemindersRef.current = reminders.filter((r) => !r.completed);
  }, [reminders]);

  const checkDueReminders = useCallback((): void => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    const now = Date.now();
    pendingRemindersRef.current.forEach((r) => {
      if (firedRef.current.has(r.id)) return;
      const triggerAt = new Date(r.eventAt).getTime() - r.notifyBefore * 60_000;
      if (triggerAt <= now) {
        new Notification(r.description, {
          body: r.opportunity.name,
          tag: r.id,
        });
        firedRef.current.add(r.id);
      }
    });
  }, []);

  // Run a check immediately after reminders are loaded/updated, then poll every minute
  const fetchReminders = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reminderService.list({
        completed: showCompleted ? 'true' : 'false',
      });
      setReminders(data);
      // Update ref synchronously so checkDueReminders sees the fresh list immediately
      pendingRemindersRef.current = data.filter((r) => !r.completed);
      checkDueReminders();
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsLoading(false);
    }
  }, [showCompleted, checkDueReminders]);

  const createReminder = useCallback(async (
    payload: CreateReminderPayload,
  ): Promise<ReminderListItem> => {
    const created = await reminderService.create(payload);
    const fresh = await reminderService.list({ completed: 'false' });
    if (!showCompleted) {
      setReminders(fresh);
      pendingRemindersRef.current = fresh.filter((r) => !r.completed);
      checkDueReminders();
    }
    return created;
  }, [showCompleted, checkDueReminders]);

  const markComplete = useCallback(async (id: string): Promise<void> => {
    await reminderService.markComplete(id);
    firedRef.current.delete(id);
    setReminders((prev) =>
      showCompleted
        ? prev.map((r) => r.id === id ? { ...r, completed: true, completedAt: new Date().toISOString() } : r)
        : prev.filter((r) => r.id !== id),
    );
  }, [showCompleted]);

  const requestNotificationPermission = useCallback(async (): Promise<NotificationPermission | 'unsupported'> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      return 'unsupported';
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission;
    }

    setNotificationPermission(Notification.permission);
    return Notification.permission;
  }, []);

  // Sync browser permission on mount, then fetch reminders
  useEffect(() => {
    const init = async (): Promise<void> => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotificationPermission(Notification.permission);
      } else {
        setNotificationPermission('unsupported');
      }
      void fetchReminders();
    };
    void init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-fetch when the completed toggle changes
  useEffect(() => {
    void fetchReminders();
  }, [showCompleted, fetchReminders]);

  // Background poll every minute to catch reminders that become due while tab is open
  useEffect(() => {
    const intervalId = setInterval(checkDueReminders, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [checkDueReminders]);

  return (
    <ReminderContext.Provider
      value={{
        reminders,
        isLoading,
        error,
        showCompleted,
        notificationPermission,
        setShowCompleted,
        fetchReminders,
        createReminder,
        markComplete,
        requestNotificationPermission,
      }}
    >
      {children}
    </ReminderContext.Provider>
  );
}
