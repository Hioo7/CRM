import { useState } from 'react';
import {
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlinePhone,
} from 'react-icons/hi2';
import type { ReminderListItem } from '@/types/reminder';

interface ReminderCardProps {
  reminder: ReminderListItem;
  onMarkComplete: (id: string) => Promise<void>;
}

function getCustomerLabel(reminder: ReminderListItem): string {
  const { firstName, lastName, company } = reminder.opportunity.customer;
  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  if (company && fullName) {
    return `${fullName} - ${company}`;
  }

  if (company) {
    return company;
  }

  return fullName || 'Unnamed customer';
}

export function ReminderCard({ reminder, onMarkComplete }: ReminderCardProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const customerLabel = getCustomerLabel(reminder);
  const phone = reminder.opportunity.customer.phone?.trim() ?? '';
  const hasPhone = Boolean(phone);

  const handleComplete = async (): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onMarkComplete(reminder.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard-card flex flex-col gap-3 px-4 py-4 md:gap-4 md:px-5 md:py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="dashboard-kicker">{reminder.opportunity.name}</p>
          <p className="mt-2 text-sm text-slate-500">{customerLabel}</p>
          {hasPhone ? (
            <p className="mt-1 text-xs font-medium text-slate-400">{phone}</p>
          ) : null}
          <p className="mt-2 text-base font-semibold text-slate-900">{reminder.description}</p>
        </div>
        {hasPhone ? (
          <a
            href={`tel:${phone}`}
            className="btn btn-sm shrink-0 rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
            aria-label={`Call ${customerLabel}`}
          >
            <HiOutlinePhone className="h-4 w-4" />
            Call
          </a>
        ) : null}
      </div>

      <div className="rounded-[1.25rem] border border-stone-200/80 bg-stone-50/75 px-3 py-3 md:rounded-[1.5rem] md:px-4 md:py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <HiOutlineCalendar className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{new Date(reminder.eventAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <HiOutlineBell className="h-4 w-4 shrink-0 text-slate-400" />
            <span>{reminder.notifyBefore} min before</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Created {new Date(reminder.createdAt).toLocaleDateString()}
        </p>
        {reminder.completed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <HiOutlineCheckCircle className="h-3.5 w-3.5" />
            Completed
            {reminder.completedAt ? ` · ${new Date(reminder.completedAt).toLocaleDateString()}` : ''}
          </span>
        ) : (
          <button
            type="button"
            className="btn btn-sm rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-none hover:bg-emerald-100"
            onClick={handleComplete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              <HiOutlineCheckCircle className="h-4 w-4" />
            )}
            Mark Complete
          </button>
        )}
      </div>
    </div>
  );
}
