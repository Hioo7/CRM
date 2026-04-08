import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineArrowRight,
  HiOutlineArrowDownTray,
  HiOutlineBellAlert,
  HiOutlineBolt,
  HiOutlineBriefcase,
  HiOutlineClipboardDocumentList,
  HiOutlineShieldCheck,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { usePwaInstall } from '@/hooks/usePwaInstall';

const featureCards = [
  {
    icon: HiOutlineClipboardDocumentList,
    title: 'Lead Workspace',
    description:
      'Capture customer details, keep access under control, and move quickly through outreach-ready lead lists.',
  },
  {
    icon: HiOutlineBriefcase,
    title: 'Pipeline Tracking',
    description:
      'Manage opportunities through explicit stages with a clear history of progress, notes, and ownership.',
  },
  {
    icon: HiOutlineBellAlert,
    title: 'Reminder Flow',
    description:
      'Follow-ups stay visible with reminder workflows built for high-volume daily lead handling.',
  },
  {
    icon: HiOutlineBolt,
    title: 'Quick Messages',
    description:
      'Generate copy-ready messages from reusable templates filled with customer fields in seconds.',
  },
  {
    icon: HiOutlineUsers,
    title: 'Team Control',
    description:
      'Admins can monitor employee activity, review records across the team, and keep work moving.',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Role-Based Access',
    description:
      'Employee, admin, and super-admin workspaces stay separated while sharing the same operational system.',
  },
] as const;

const workflowSteps = [
  {
    label: 'Capture',
    title: 'Keep leads organized from the first touch',
    description:
      'Store customer details, review ownership, and keep records available to the right people.',
  },
  {
    label: 'Advance',
    title: 'Move opportunities with visible stage progress',
    description:
      'Track pipeline movement with stage changes, note history, and collaboration-ready access controls.',
  },
  {
    label: 'Reach Out',
    title: 'Generate outreach faster with quick messages',
    description:
      'Fill reusable message templates with customer data, spot missing fields, copy, and send.',
  },
] as const;

export function LandingPage() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const { canInstall, isInstalled, requestInstall } = usePwaInstall();

  const handleInstallConfirm = async (): Promise<void> => {
    if (canInstall) {
      await requestInstall();
    }
    setIsInstallModalOpen(false);
  };

  return (
    <div className="landing-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
        <header className="landing-panel sticky top-2 z-20 mb-4 sm:top-4 sm:mb-6">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 md:px-7 md:py-5">
            <div>
              <p className="dashboard-kicker">CRM Workspace</p>
              <h1 className="mt-2 text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                Lead Operations CRM
              </h1>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
              <button
                type="button"
                className="btn w-full justify-center rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400 sm:w-auto"
                onClick={() => setIsInstallModalOpen(true)}
                disabled={isInstalled}
              >
                <HiOutlineArrowDownTray className="h-5 w-5" />
                {isInstalled ? 'Installed' : 'Install App'}
              </button>
              <Link
                to="/login"
                className="btn w-full justify-center rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              >
                Employee Login
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-6">
          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="landing-panel overflow-hidden px-5 py-6 md:px-8 md:py-8">
              <p className="dashboard-kicker">Focused Operations</p>
              <h2 className="mt-4 max-w-3xl text-[2.45rem] font-semibold tracking-tight leading-[1.05] text-slate-900 md:text-6xl md:leading-[1.02]">
                move leads, pipeline work, reminders, and outreach from one clear system.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                This CRM is built for teams that need speed without losing control. Employees work through leads and
                follow-ups quickly, while admins keep visibility over customers, opportunities, activity, and reusable
                quick message templates.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="btn h-12 w-full rounded-2xl border-0 bg-emerald-600 px-6 text-white shadow-[0_12px_26px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
                >
                  Employee Login
                  <HiOutlineArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="#features"
                  className="btn h-12 w-full rounded-2xl border border-stone-200 bg-white px-6 text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
                >
                  View Features
                </a>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <section className="landing-panel px-5 py-5 md:px-6">
                <p className="dashboard-kicker">Live Focus</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-900">What the workspace actually handles</h3>
                <div className="mt-5 grid gap-3">
                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/75 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Leads</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Customer records, ownership visibility, and structured detail editing.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/75 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Opportunities</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Stage tracking, stage history, access management, and follow-up readiness.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/75 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Quick Messages</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      Template-driven outreach with customer fields filled in instantly and unresolved fields flagged.
                    </p>
                  </div>
                </div>
              </section>

              <section className="landing-panel px-5 py-5 md:px-6">
                <p className="dashboard-kicker">Who Uses It</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50/75 px-4 py-4">
                    <p className="text-sm font-semibold text-emerald-900">Employees</p>
                    <p className="mt-1 text-sm leading-6 text-emerald-900/80">
                      Handle leads, opportunities, reminders, profiles, and quick message generation.
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50/75 px-4 py-4">
                    <p className="text-sm font-semibold text-amber-900">Admins</p>
                    <p className="mt-1 text-sm leading-6 text-amber-900/80">
                      Review team activity, edit records across the workspace, and manage message templates.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </section>

          <section id="features" className="landing-panel px-5 py-6 md:px-8 md:py-8">
            <p className="dashboard-kicker">Features</p>
            <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <h3 className="dashboard-section-title">Built around daily lead throughput</h3>
                <p className="dashboard-section-copy mt-3">
                  The product is designed around operational speed: less switching, less searching, and fewer manual
                  steps between identifying a customer and taking action.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, description }) => (
                <article key={title} className="dashboard-card px-5 py-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="mt-5 text-lg font-semibold text-slate-900">{title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-panel px-5 py-6 md:px-8 md:py-8">
            <p className="dashboard-kicker">Workflow</p>
            <h3 className="dashboard-section-title mt-4">A simple daily rhythm</h3>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {workflowSteps.map((step) => (
                <article key={step.label} className="dashboard-card px-5 py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700/80">{step.label}</p>
                  <h4 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-panel px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="dashboard-kicker">Get Started</p>
                <h3 className="dashboard-section-title mt-4">Enter the workspace and start moving through leads faster.</h3>
                <p className="dashboard-section-copy mt-3">
                  Sign in from the employee login and the system will route you to the correct workspace based on your role.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/login"
                  className="btn h-12 w-full rounded-2xl border-0 bg-emerald-600 px-6 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
                >
                  Employee Login
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      {isInstallModalOpen ? (
        <dialog className="modal modal-open">
          <div className="modal-box max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-md overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
            <div className="border-b border-emerald-100 bg-emerald-50/80 px-5 py-4 md:px-6 md:py-5">
              <p className="dashboard-kicker">Install</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">Install CRM App</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Do you want to install this application on your device?
              </p>
            </div>

            <div className="px-5 py-5 md:px-6 md:py-6">
              {!canInstall ? (
                <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Installation prompt is not available yet in this browser context.
                </div>
              ) : null}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
                  onClick={() => setIsInstallModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
                  onClick={() => void handleInstallConfirm()}
                  disabled={!canInstall}
                >
                  Install
                </button>
              </div>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setIsInstallModalOpen(false)}>close</button>
          </form>
        </dialog>
      ) : null}
    </div>
  );
}
