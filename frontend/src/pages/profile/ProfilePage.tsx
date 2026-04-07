import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowRightStartOnRectangle,
  HiOutlineEnvelope,
  HiOutlineIdentification,
  HiOutlineKey,
  HiOutlinePencilSquare,
} from 'react-icons/hi2';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useModalState } from '@/hooks/useModalState';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateUpdateSelfForm, validateConfirmPassword } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ROLE_LABELS } from '@/config/constants';

interface UpdateEmailModalProps {
  isOpen: boolean;
  currentEmail: string;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
}

function UpdateEmailModal({ isOpen, currentEmail, onClose, onSubmit }: UpdateEmailModalProps) {
  const banner = useErrorBanner();
  const [email, setEmail] = useState(currentEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const validationError = validateUpdateSelfForm({ email });
    if (validationError) {
      banner.showError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(email.trim());
      handleClose();
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <HiOutlineEnvelope className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker">Profile Update</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Change email</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Update the address used for account recovery and workspace communication.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current Email</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{currentEmail}</p>
          </div>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">New Email</span>
            <input
              type="email"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Save Email'}
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

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
}

function ChangePasswordModal({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) {
  const banner = useErrorBanner();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const confirmError = validateConfirmPassword(form.password, form.confirmPassword);
    if (confirmError) {
      banner.showError(confirmError);
      return;
    }

    const validationError = validateUpdateSelfForm({ password: form.password });
    if (validationError) {
      banner.showError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form.password);
      handleClose();
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="flex items-start gap-4 border-b border-amber-100 bg-amber-50/80 px-6 py-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <HiOutlineKey className="h-6 w-6" />
          </div>
          <div>
            <p className="dashboard-kicker text-amber-700/80">Security</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Change password</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Rotate your password to keep your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">New Password</span>
            <input
              type="password"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Minimum 8 characters"
            />
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Confirm Password</span>
            <input
              type="password"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.confirmPassword}
              onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Re-enter the new password"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button type="button" className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto" onClick={handleClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Change Password'}
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

export function ProfilePage() {
  const { logout } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const navigate = useNavigate();
  const emailModal = useModalState();
  const passwordModal = useModalState();
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const handleEmailSubmit = async (email: string): Promise<void> => {
    setEmailSuccess(false);
    await updateProfile({ email });
    setEmailSuccess(true);
  };

  const handlePasswordSubmit = async (password: string): Promise<void> => {
    setPasswordSuccess(false);
    await updateProfile({ password });
    setPasswordSuccess(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="max-w-2xl">
          <p className="dashboard-kicker">Account</p>
          <h2 className="dashboard-section-title mt-3">Profile</h2>
          <p className="dashboard-section-copy mt-3">
            Keep your email and credentials current, and use the session controls below when you need to sign out.
          </p>
        </div>
      </section>

      {profile ? (
        <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Summary</p>
              <h3 className="mt-3 text-2xl font-semibold text-slate-900">{profile.username}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                Manage your account details and credentials.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <HiOutlineEnvelope className="h-5 w-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.14em]">Email</span>
                  </div>
                  <button
                    className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-100"
                    onClick={emailModal.open}
                  >
                    <HiOutlinePencilSquare className="h-4 w-4" />
                    Edit
                  </button>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.email}</p>
                {emailSuccess ? (
                  <p className="mt-2 text-xs font-medium text-emerald-700">Email updated successfully.</p>
                ) : null}
              </div>
              <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 px-4 py-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <HiOutlineIdentification className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">Role</span>
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{ROLE_LABELS[profile.role] ?? profile.role}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="dashboard-card px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="mb-3 flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <HiOutlineKey className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Change password</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Open a dedicated security modal only when you actually want to rotate the password.
                </p>
              </div>
            </div>
            {passwordSuccess ? (
              <div role="alert" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                Password changed successfully.
              </div>
            ) : null}
          </div>
          <button
            className="btn rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50"
            onClick={passwordModal.open}
          >
            <HiOutlineKey className="h-5 w-5" />
            Change Password
          </button>
        </div>
      </section>

      <section className="dashboard-card border-red-100 px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-600/80">Session</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Log out</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              End your current session on this device when you are done.
            </p>
          </div>
          <button
            className="btn rounded-2xl border-0 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.22)] hover:bg-red-700"
            onClick={handleLogout}
          >
            <HiOutlineArrowRightStartOnRectangle className="h-5 w-5" />
            Logout
          </button>
        </div>
      </section>

      {profile ? (
        <UpdateEmailModal
          key={`email-${profile.email}`}
          isOpen={emailModal.isOpen}
          currentEmail={profile.email}
          onClose={emailModal.close}
          onSubmit={handleEmailSubmit}
        />
      ) : null}
      <ChangePasswordModal
        key={`password-${passwordModal.isOpen ? 'open' : 'closed'}`}
        isOpen={passwordModal.isOpen}
        onClose={passwordModal.close}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
}
