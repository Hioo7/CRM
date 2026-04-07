import { useEffect } from 'react';
import { HiOutlineBell } from 'react-icons/hi2';
import { useReminders } from '@/hooks/useReminders';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { ReminderCard } from '@/components/reminders/ReminderCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBanner } from '@/components/ErrorBanner';

export function RemindersPage() {
  const {
    reminders,
    isLoading,
    error,
    showCompleted,
    setShowCompleted,
    markComplete,
    notificationPermission,
    requestNotificationPermission,
  } = useReminders();
  const banner = useErrorBanner();

  useEffect(() => {
    if (error) {
      banner.showError(error);
    }
  }, [banner, error]);

  if (isLoading) return <LoadingSpinner />;

  const handleMarkComplete = async (id: string): Promise<void> => {
    try {
      await markComplete(id);
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
    }
  };

  const handleNotificationAccess = async (): Promise<void> => {
    try {
      const permission = await requestNotificationPermission();

      if (permission === 'denied') {
        banner.showError('Browser notifications are blocked. Enable them in your browser site settings.');
      }
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
    }
  };

  const isNotificationGranted = notificationPermission === 'granted';
  const isNotificationUnsupported = notificationPermission === 'unsupported';

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-4 py-4 md:px-6 md:py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <p className="dashboard-kicker">Reminders</p>
            <h2 className="dashboard-section-title mt-2">My Reminders</h2>
            <p className="dashboard-section-copy mt-2">
              {reminders.length}{' '}
              {showCompleted ? 'completed' : 'active'} reminder
              {reminders.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 md:max-w-[18rem] md:justify-end">
            <button
              type="button"
              className={[
                'inline-flex min-h-11 items-center gap-2.5 rounded-full border px-3 py-2 text-sm font-semibold transition-colors',
                isNotificationGranted
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  : 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
                isNotificationUnsupported ? 'cursor-not-allowed opacity-60' : '',
              ].join(' ')}
              onClick={handleNotificationAccess}
              disabled={isNotificationUnsupported}
              aria-label={
                isNotificationGranted
                  ? 'Notifications enabled'
                  : 'Enable browser notifications'
              }
            >
              <span className="relative inline-flex h-5 w-5 items-center justify-center">
                <HiOutlineBell className="h-5 w-5" />
                <span
                  className={[
                    'absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[10px] font-bold text-white',
                    isNotificationGranted ? 'bg-emerald-600' : 'bg-amber-500',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {isNotificationGranted ? '✓' : '!'}
                </span>
              </span>
              <span>
                {isNotificationUnsupported
                  ? 'Notifications Unavailable'
                  : isNotificationGranted
                    ? 'Notifications Enabled'
                    : 'Notifications Off'}
              </span>
            </button>

            <button
              type="button"
              className={[
                'shrink-0 rounded-full border px-3 py-2 text-sm font-semibold transition-colors',
                showCompleted
                  ? 'border-stone-300 bg-stone-100 text-slate-700 hover:bg-stone-200'
                  : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50',
              ].join(' ')}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? 'Show Active' : 'Show Completed'}
            </button>
          </div>
        </div>
      </section>

      <ErrorBanner message={banner.error} />

      {reminders.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <HiOutlineBell className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-xl font-semibold text-slate-900">No reminders</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {showCompleted
              ? 'No completed reminders yet.'
              : 'Open an opportunity and tap the bell icon to create a reminder.'}
          </p>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onMarkComplete={handleMarkComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
