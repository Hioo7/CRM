import { useState } from 'react';
import { HiOutlineKey, HiOutlinePencilSquare } from 'react-icons/hi2';
import { useEmployees } from '@/hooks/useEmployees';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateUpdateEmployeeForm } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import { MANAGEABLE_ROLES, ROLE_LABELS } from '@/config/constants';
import type { Employee } from '@/types/auth';
import type { UpdateEmployeePayload } from '@/types/employee';

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
}

interface EditForm {
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

function createInitialForm(employee: Employee | null): EditForm {
  return {
    email: employee?.email ?? '',
    password: '',
    role: employee?.role === 'SUPER_ADMIN' ? 'ADMIN' : (employee?.role ?? 'EMPLOYEE'),
  };
}

export function EditEmployeeModal({ isOpen, employee, onClose }: EditEmployeeModalProps) {
  const { updateEmployee } = useEmployees();
  const { error, showError, clearError } = useErrorBanner();
  const [form, setForm] = useState<EditForm>(() => createInitialForm(employee));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !employee) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    clearError();
    onClose();
  };

  const handleChange = (field: keyof EditForm, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const payload: UpdateEmployeePayload = {};
    if (form.email.trim() !== employee.email) {
      payload.email = form.email.trim();
    }
    if (form.password.trim()) {
      payload.password = form.password.trim();
    }
    if (form.role !== employee.role) {
      payload.role = form.role;
    }

    const validationError = validateUpdateEmployeeForm(payload);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await updateEmployee(employee.id, payload);
      handleClose();
    } catch (err) {
      showError(extractApiErrorMessage(err as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-amber-100 bg-amber-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <HiOutlinePencilSquare className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker text-amber-700/80">Access Update</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Edit employee</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Adjust contact details, rotate credentials, or update the employee&apos;s management level.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <ErrorBanner message={error} />

          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Employee</p>
            <p className="mt-2 text-base font-semibold text-slate-900">@{employee.username}</p>
            <p className="mt-1 text-sm text-slate-600">{employee.email}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_15rem]">
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">Email</span>
              <input
                type="email"
                className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
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

          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
            <div className="mb-3 flex items-center gap-2">
              <HiOutlineKey className="h-5 w-5 text-amber-700" />
              <p className="text-sm font-semibold text-slate-800">Rotate password</p>
            </div>
            <label className="form-control">
              <span className="mb-2 text-sm font-semibold text-slate-700">New Password</span>
              <input
                type="password"
                className="input h-12 rounded-2xl border-stone-200 bg-white text-slate-900"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Leave blank to keep the current password"
              />
            </label>
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
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Save Changes'}
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
