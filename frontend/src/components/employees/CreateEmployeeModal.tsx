import { useState } from 'react';
import { HiOutlineShieldCheck, HiOutlineUserPlus } from 'react-icons/hi2';
import { useEmployees } from '@/hooks/useEmployees';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateCreateEmployeeForm } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import { MANAGEABLE_ROLES, ROLE_LABELS } from '@/config/constants';
import type { CreateEmployeePayload } from '@/types/employee';

interface CreateEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL: CreateEmployeePayload = { username: '', email: '', password: '', role: 'EMPLOYEE' };

export function CreateEmployeeModal({ isOpen, onClose }: CreateEmployeeModalProps) {
  const { createEmployee } = useEmployees();
  const { error, showError, clearError } = useErrorBanner();
  const [form, setForm] = useState<CreateEmployeePayload>(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    setForm(INITIAL);
    clearError();
    onClose();
  };

  const handleChange = (field: keyof CreateEmployeePayload, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const validationError = validateCreateEmployeeForm(form);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await createEmployee(form);
      handleClose();
    } catch (err) {
      showError(extractApiErrorMessage(err as Error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlineUserPlus className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker">New Access</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Create employee</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Add a new team member and assign the appropriate operational role from the start.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <ErrorBanner message={error} />

          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Username</span>
              <input
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.username}
                onChange={(e) => handleChange('username', e.target.value)}
                placeholder="Choose a username"
              />
            </label>

            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="name@company.com"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Password</span>
              <input
                type="password"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </label>

            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Role</span>
              <select
                className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                {MANAGEABLE_ROLES.map((role) => (
                  <option key={role} value={role}>{ROLE_LABELS[role]}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <HiOutlineShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
              <p>Use employee roles for routine operations and reserve admin access only for staff who need management permissions.</p>
            </div>
          </div>

          <div className="modal-action mt-0">
            <button type="button" className="btn rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Employee'}
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
