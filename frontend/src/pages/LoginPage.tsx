import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRightOnRectangle, HiOutlineCheckBadge, HiOutlineEnvelope, HiOutlineKey, HiOutlineShieldCheck, HiOutlineUsers } from 'react-icons/hi2';
import { useAuth } from '@/hooks/useAuth';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { validateLoginForm } from '@/utils/validators';
import { extractApiErrorMessage } from '@/utils/errors';
import { ErrorBanner } from '@/components/ErrorBanner';
import type { LoginPayload } from '@/types/auth';

const trustPoints = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Secure access',
    description: 'Protected sign-in for CRM workspace administration and account management.',
  },
  {
    icon: HiOutlineUsers,
    title: 'People operations',
    description: 'Manage employees, roles, and protected records from one warm, focused interface.',
  },
  {
    icon: HiOutlineCheckBadge,
    title: 'Profile control',
    description: 'Update your own account settings and maintain operational readiness without friction.',
  },
] as const;

export function LoginPage() {
  const { login } = useAuth();
  const { error, showError } = useErrorBanner();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginPayload>({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof LoginPayload, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const validationError = validateLoginForm(form);
    if (validationError) {
      showError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(form);
      navigate('/super-admin/dashboard/users', { replace: true });
    } catch (err) {
      showError(extractApiErrorMessage(err as Error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-8 md:px-6">
        <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="auth-panel order-2 overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:order-1">
            <div className="flex h-full flex-col justify-between gap-8">
              <div>
                <p className="dashboard-kicker">CRM Workspace</p>
                <h1 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl md:leading-[1.05]">
                  controlled access for your entire team.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                  Sign in to manage employees, protect high-value accounts, and keep operational tasks moving inside a polished admin workspace.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {trustPoints.map(({ icon: Icon, title, description }) => (
                  <article key={title} className="rounded-[1.5rem] border border-stone-200 bg-stone-50/85 px-4 py-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-slate-900">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="auth-panel order-1 px-5 py-6 md:px-8 md:py-8 lg:order-2">
            <div className="mx-auto flex max-w-lg flex-col gap-6">
              <div>
                <p className="dashboard-kicker">Sign In</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Enter your email and password to continue into the CRM admin workspace.
                </p>
              </div>

              <ErrorBanner message={error} />

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="form-control">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlineEnvelope className="h-4 w-4 text-slate-500" />
                    Email
                  </span>
                  <input
                    className="auth-input w-full"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </label>

                <label className="form-control">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <HiOutlineKey className="h-4 w-4 text-slate-500" />
                    Password
                  </span>
                  <input
                    type="password"
                    className="auth-input w-full"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </label>

                <button
                  type="submit"
                  className="btn mt-2 h-12 w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : (
                    <>
                      <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                      Login
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
