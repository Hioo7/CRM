import { Outlet } from 'react-router-dom';
import { EmployeeProvider } from '@/providers/EmployeeProvider';
import { DashboardBottomNav } from '@/components/navigation/DashboardBottomNav';

export function DashboardLayout() {
  return (
    <EmployeeProvider>
      <div className="dashboard-shell">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-5 md:px-6 md:pt-6">
          <header className="dashboard-panel sticky top-4 z-20 mb-6">
            <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-7 md:py-5">
              <div>
                <p className="dashboard-kicker">Super Admin Workspace</p>
                <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">CRM Command Center</h1>
              </div>
              <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 md:block">
                Users and profile management
              </div>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>

          <DashboardBottomNav />
        </div>
      </div>
    </EmployeeProvider>
  );
}
