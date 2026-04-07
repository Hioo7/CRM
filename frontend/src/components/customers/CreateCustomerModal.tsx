import { useState } from 'react';
import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateCreateCustomerForm } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import type { CreateCustomerPayload } from '@/types/customer';

interface CreateCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateCustomerPayload) => Promise<void>;
}

const EMPTY_FORM: CreateCustomerPayload = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
};

export function CreateCustomerModal({ isOpen, onClose, onSubmit }: CreateCustomerModalProps) {
  const banner = useErrorBanner();
  const [form, setForm] = useState<CreateCustomerPayload>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = (): void => {
    if (isSubmitting) return;
    banner.clearError();
    setForm(EMPTY_FORM);
    onClose();
  };

  const set = (field: keyof CreateCustomerPayload, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const payload: CreateCustomerPayload = {
      firstName: form.firstName?.trim() || undefined,
      lastName: form.lastName?.trim() || undefined,
      company: form.company?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phone: form.phone?.trim() || undefined,
    };

    const err = validateCreateCustomerForm(payload);
    if (err) {
      banner.showError(err);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      handleClose();
    } catch (submitErr) {
      banner.showError(extractApiErrorMessage(submitErr as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlineUserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker">Leads</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">New Customer</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add the basics now — fill in the rest from the customer detail page.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <div className="grid grid-cols-2 gap-4">
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">First Name</span>
              <input
                type="text"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.firstName ?? ''}
                onChange={(e) => set('firstName', e.target.value)}
                placeholder="Alice"
              />
            </label>
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Last Name</span>
              <input
                type="text"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.lastName ?? ''}
                onChange={(e) => set('lastName', e.target.value)}
                placeholder="Benson"
              />
            </label>
          </div>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Company</span>
            <input
              type="text"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.company ?? ''}
              onChange={(e) => set('company', e.target.value)}
              placeholder="Acme Corp (optional)"
            />
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Email</span>
            <input
              type="email"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.email ?? ''}
              onChange={(e) => set('email', e.target.value)}
              placeholder="alice@company.com (optional)"
            />
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Phone</span>
            <input
              type="tel"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.phone ?? ''}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="+1 415 000 0000 (optional)"
            />
          </label>

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
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Customer'}
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
