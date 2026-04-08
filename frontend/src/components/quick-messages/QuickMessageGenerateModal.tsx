import { useMemo, useState } from 'react';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { getCustomerDisplayName } from '@/utils/quickMessages';
import type { CustomerListItem } from '@/types/customer';
import type { QuickMessageTemplate } from '@/types/quickMessage';

interface QuickMessageGenerateModalProps {
  isOpen: boolean;
  isGenerating: boolean;
  customers: CustomerListItem[];
  template: QuickMessageTemplate | null;
  onClose: () => void;
  onGenerate: (customerId: string) => Promise<void>;
}

export function QuickMessageGenerateModal({
  isOpen,
  isGenerating,
  customers,
  template,
  onClose,
  onGenerate,
}: QuickMessageGenerateModalProps) {
  const banner = useErrorBanner();
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  const sortedCustomers = useMemo(
    () =>
      [...customers].sort((left, right) =>
        getCustomerDisplayName(left).localeCompare(getCustomerDisplayName(right)),
      ),
    [customers],
  );

  if (!isOpen || !template) {
    return null;
  }

  const handleClose = (): void => {
    if (isGenerating) {
      return;
    }

    banner.clearError();
    setSelectedCustomerId('');
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!selectedCustomerId) {
      banner.showError('Please select a customer.');
      return;
    }

    try {
      await onGenerate(selectedCustomerId);
      setSelectedCustomerId('');
      banner.clearError();
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-lg overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <p className="dashboard-kicker">Generate</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{template.name}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Pick the customer and generate a ready-to-send version of this message.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50/80 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Template
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {template.content}
            </p>
          </div>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Customer</span>
            <select
              className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={selectedCustomerId}
              onChange={(event) => setSelectedCustomerId(event.target.value)}
            >
              <option value="">Select customer...</option>
              {sortedCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {getCustomerDisplayName(customer)}
                </option>
              ))}
            </select>
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
              disabled={isGenerating}
            >
              {isGenerating ? <span className="loading loading-spinner loading-sm" /> : 'Generate Message'}
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
