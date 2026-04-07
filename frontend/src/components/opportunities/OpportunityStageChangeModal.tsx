import { useState } from 'react';
import { HiOutlineArrowPathRoundedSquare } from 'react-icons/hi2';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { validateOpportunityStageChangeForm } from '@/utils/validators';
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { ChangeOpportunityStagePayload, OpportunityStage } from '@/types/opportunity';

interface OpportunityStageChangeModalProps {
  isOpen: boolean;
  currentStage: OpportunityStage;
  onClose: () => void;
  onSubmit: (payload: ChangeOpportunityStagePayload) => Promise<void>;
}

interface StageChangeFormState {
  toStage: OpportunityStage;
  notes: string;
}

export function OpportunityStageChangeModal({
  isOpen,
  currentStage,
  onClose,
  onSubmit,
}: OpportunityStageChangeModalProps) {
  const banner = useErrorBanner();
  const [form, setForm] = useState<StageChangeFormState>({
    toStage: currentStage,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    setForm({ toStage: currentStage, notes: '' });
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const payload: ChangeOpportunityStagePayload = {
      toStage: form.toStage,
      notes: form.notes.trim() || undefined,
    };

    const error = validateOpportunityStageChangeForm(payload);
    if (error) {
      banner.showError(error);
      return;
    }

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
            <HiOutlineArrowPathRoundedSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker">Progress</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Mark New Stage</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Current stage: {OPPORTUNITY_STAGE_LABELS[currentStage]}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Move to stage</span>
            <select
              className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.toStage}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  toStage: event.target.value as OpportunityStage,
                }))
              }
            >
              {OPPORTUNITY_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {OPPORTUNITY_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Notes</span>
            <textarea
              className="textarea min-h-32 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              placeholder="Optional context for this stage change"
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
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Save Stage'}
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
