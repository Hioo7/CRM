import { useState } from 'react';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateCustomerField } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import { COUNTRIES } from '@/config/constants';
import type { UpdateCustomerPayload } from '@/types/customer';

interface EditFieldModalProps {
  isOpen: boolean;
  fieldKey: keyof UpdateCustomerPayload;
  fieldLabel: string;
  currentValue: string;
  onClose: () => void;
  onSubmit: (value: string) => Promise<void>;
}

export function EditFieldModal({
  isOpen,
  fieldKey,
  fieldLabel,
  currentValue,
  onClose,
  onSubmit,
}: EditFieldModalProps) {
  const banner = useErrorBanner();
  const [value, setValue] = useState(currentValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = (): void => {
    if (isSubmitting) return;
    banner.clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const err = validateCustomerField(fieldKey, value);
    if (err) {
      banner.showError(err);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(value.trim());
      handleClose();
    } catch (submitErr) {
      banner.showError(extractApiErrorMessage(submitErr as Error));
      setIsSubmitting(false);
    }
  };

  const isCountry = fieldKey === 'country';
  const isNotes = fieldKey === 'notes';
  const isLinkedin = fieldKey === 'linkedinProfileUrl';
  const isInstagram = fieldKey === 'instagramHandle';

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-md overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlinePencilSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="dashboard-kicker">Edit Field</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">Update {fieldLabel}</h3>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          {currentValue ? (
            <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Current</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{currentValue}</p>
            </div>
          ) : null}

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">New {fieldLabel}</span>
            {isCountry ? (
              <select
                className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : isNotes ? (
              <textarea
                className="textarea rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                rows={4}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Add notes..."
              />
            ) : (
              <input
                type={
                  fieldKey === 'email'
                    ? 'email'
                    : fieldKey === 'phone'
                    ? 'tel'
                    : isLinkedin
                    ? 'url'
                    : 'text'
                }
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  fieldKey === 'phone'
                    ? '+1 415 000 0000'
                    : isInstagram
                    ? 'markrover'
                    : isLinkedin
                    ? 'https://www.linkedin.com/in/markrover'
                    : ''
                }
              />
            )}
          </label>

          {fieldKey === 'phone' ? (
            <p className="text-xs text-slate-500">Include the country code, e.g. +1 for US, +44 for UK.</p>
          ) : null}

          {isInstagram ? (
            <p className="text-xs text-slate-500">Use the handle only. Do not include `@` or the Instagram URL.</p>
          ) : null}

          {isLinkedin ? (
            <p className="text-xs text-slate-500">Paste the full LinkedIn profile URL from linkedin.com.</p>
          ) : null}

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
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Save'}
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
