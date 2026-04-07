import { useState } from 'react';
import { HiOutlineBell } from 'react-icons/hi2';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import type { CreateReminderPayload } from '@/types/reminder';

interface CreateReminderModalProps {
  isOpen: boolean;
  opportunityId: string;
  opportunityName: string;
  onClose: () => void;
  onSubmit: (payload: CreateReminderPayload) => Promise<void>;
}

interface FormState {
  description: string;
  eventDate: string;
  eventTime: string;
  notifyBefore: number;
}

const EMPTY_FORM: FormState = {
  description: '',
  eventDate: '',
  eventTime: '',
  notifyBefore: 15,
};

const NOTIFY_PRESETS = [5, 15, 30, 60] as const;

export function CreateReminderModal({
  isOpen,
  opportunityId,
  opportunityName,
  onClose,
  onSubmit,
}: CreateReminderModalProps) {
  const banner = useErrorBanner();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) return;
    banner.clearError();
    setForm(EMPTY_FORM);
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!form.description.trim()) {
      banner.showError('Description is required.');
      return;
    }

    if (!form.eventDate || !form.eventTime) {
      banner.showError('Event date and time are required.');
      return;
    }

    if (form.notifyBefore < 1) {
      banner.showError('Notify before must be at least 1 minute.');
      return;
    }

    const eventAt = new Date(`${form.eventDate}T${form.eventTime}`).toISOString();

    const payload: CreateReminderPayload = {
      opportunityId,
      description: form.description.trim(),
      eventAt,
      notifyBefore: form.notifyBefore,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      handleClose();
    } catch (submitError) {
      banner.showError(extractApiErrorMessage(submitError as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlineBell className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker">Reminders</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Create Reminder</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">{opportunityName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Description</span>
            <input
              type="text"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              placeholder="What should I be reminded about?"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Event date</span>
              <input
                type="date"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.eventDate}
                onChange={(e) => setForm((prev) => ({ ...prev, eventDate: e.target.value }))}
              />
            </label>

            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Event time</span>
              <input
                type="time"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.eventTime}
                onChange={(e) => setForm((prev) => ({ ...prev, eventTime: e.target.value }))}
              />
            </label>
          </div>

          <div className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Notify before</span>
            <div className="flex flex-wrap items-center gap-2">
              {NOTIFY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={[
                    'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                    form.notifyBefore === preset
                      ? 'border-emerald-300 bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.22)]'
                      : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50',
                  ].join(' ')}
                  onClick={() => setForm((prev) => ({ ...prev, notifyBefore: preset }))}
                >
                  {preset} min
                </button>
              ))}
              <input
                type="number"
                min={1}
                max={1440}
                className="input h-10 w-28 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.notifyBefore}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notifyBefore: Number(e.target.value) }))
                }
              />
              <span className="text-sm text-slate-500">min</span>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                'Create Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
