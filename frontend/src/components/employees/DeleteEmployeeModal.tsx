import { useState } from 'react';
import { HiOutlineExclamationTriangle, HiOutlineLockClosed } from 'react-icons/hi2';
import { useEmployees } from '@/hooks/useEmployees';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import type { EmployeeDashboardRow } from '@/types/employee';

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  row: EmployeeDashboardRow | null;
  onClose: () => void;
}

export function DeleteEmployeeModal({ isOpen, row, onClose }: DeleteEmployeeModalProps) {
  const { deleteEmployee } = useEmployees();
  const { error, showError, clearError } = useErrorBanner();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !row) {
    return null;
  }

  const handleClose = (): void => {
    if (isDeleting) {
      return;
    }

    clearError();
    onClose();
  };

  const handleConfirm = async (): Promise<void> => {
    if (!row.canDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteEmployee(row.employee.id);
      handleClose();
    } catch (err) {
      showError(extractApiErrorMessage(err as Error));
      setIsDeleting(false);
    }
  };

  const isProtected = !row.canDelete;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-xl rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className={`flex items-start gap-4 border-b px-6 py-5 ${isProtected ? 'border-stone-200 bg-stone-50' : 'border-red-200 bg-red-50'}`}>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isProtected ? 'bg-stone-200 text-slate-700' : 'bg-red-100 text-red-700'}`}>
            {isProtected ? <HiOutlineLockClosed className="h-6 w-6" /> : <HiOutlineExclamationTriangle className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{isProtected ? 'Protected account' : 'Delete employee'}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {isProtected
                ? row.lockReason
                : 'This action permanently removes the employee account and cannot be undone.'}
            </p>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <ErrorBanner message={error} />

          <div className="dashboard-card rounded-[1.5rem] border-stone-200 bg-stone-50/80 px-5 py-4 shadow-none">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Employee details</p>
            <dl className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Username</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">{row.employee.username}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</dt>
                <dd className="mt-1 text-sm text-slate-700">{row.employee.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Role</dt>
                <dd className="mt-1 text-sm text-slate-700">{row.roleLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="modal-action mt-0">
            <button type="button" className="btn rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50" onClick={handleClose}>
              {isProtected ? 'Close' : 'Cancel'}
            </button>
            {!isProtected ? (
              <button
                type="button"
                className="btn rounded-2xl border-0 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.25)] hover:bg-red-700"
                onClick={handleConfirm}
                disabled={isDeleting}
              >
                {isDeleting ? <span className="loading loading-spinner loading-sm" /> : 'Delete Employee'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
