import { useMemo, useState } from 'react';
import { HiOutlineKey } from 'react-icons/hi2';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { validateOpportunityAccessForm } from '@/utils/validators';
import { ACCESS_TYPE_LABELS } from '@/config/constants';
import type { Employee } from '@/types/auth';
import type { AccessType } from '@/types/customer';
import type { GrantOpportunityAccessPayload, OpportunityAccessEntry } from '@/types/opportunity';

interface OpportunityAccessModalProps {
  isOpen: boolean;
  employees: Employee[];
  existingAccesses: OpportunityAccessEntry[];
  currentEmployeeId: string;
  onClose: () => void;
  onSubmit: (payload: GrantOpportunityAccessPayload) => Promise<void>;
}

export function OpportunityAccessModal({
  isOpen,
  employees,
  existingAccesses,
  currentEmployeeId,
  onClose,
  onSubmit,
}: OpportunityAccessModalProps) {
  const banner = useErrorBanner();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [accessType, setAccessType] = useState<AccessType>('READ_ONLY');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEmployees = useMemo(
    () => employees.filter((employee) => employee.id !== currentEmployeeId),
    [employees, currentEmployeeId],
  );

  const existingIds = useMemo(
    () => new Set(existingAccesses.map((entry) => entry.employeeId)),
    [existingAccesses],
  );
  const alreadyHasAccess = selectedEmployeeId ? existingIds.has(selectedEmployeeId) : false;

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    setSelectedEmployeeId('');
    setAccessType('READ_ONLY');
    onClose();
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const payload: GrantOpportunityAccessPayload = {
      employeeId: selectedEmployeeId,
      accessType,
    };

    const error = validateOpportunityAccessForm(payload);
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
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-md overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlineKey className="h-5 w-5" />
          </div>
          <div>
            <p className="dashboard-kicker">Access</p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              {alreadyHasAccess ? 'Update Access' : 'Grant Access'}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Only employees are listed here. Admin and super admin access is always implied.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Employee</span>
            <select
              className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={selectedEmployeeId}
              onChange={(event) => setSelectedEmployeeId(event.target.value)}
            >
              <option value="">Select employee...</option>
              {filteredEmployees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.username} - {employee.email}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-3 block text-sm font-semibold text-slate-700">Access level</span>
            <div className="grid grid-cols-2 gap-2">
              {(['READ_ONLY', 'READ_WRITE'] as AccessType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={[
                    'rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
                    accessType === type
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50',
                  ].join(' ')}
                  onClick={() => setAccessType(type)}
                >
                  {ACCESS_TYPE_LABELS[type]}
                </button>
              ))}
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
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : alreadyHasAccess ? 'Update Access' : 'Grant Access'}
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
