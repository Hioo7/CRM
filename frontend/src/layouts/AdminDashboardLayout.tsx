import { Outlet } from 'react-router-dom';
import {
  HiOutlineBell,
  HiOutlineBriefcase,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocument,
  HiOutlineUserCircle,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { CustomerProvider } from '@/providers/CustomerProvider';
import { OpportunityProvider } from '@/providers/OpportunityProvider';
import { ReminderProvider } from '@/providers/ReminderProvider';
import { EmployeeProvider } from '@/providers/EmployeeProvider';
import { AdminMonitoringProvider } from '@/providers/AdminMonitoringProvider';
import { QuickMessageProvider } from '@/providers/QuickMessageProvider';
import { DashboardBottomNav } from '@/components/navigation/DashboardBottomNav';
import { ToolsFab } from '@/components/tools/ToolsFab';

const ADMIN_NAV = [
  { label: 'Overview', to: '/admin/dashboard/overview', icon: HiOutlineChartBarSquare },
  { label: 'Team', to: '/admin/dashboard/team', icon: HiOutlineUsers },
  { label: 'Leads', to: '/admin/dashboard/leads', icon: HiOutlineClipboardDocument },
  { label: 'Opportunities', to: '/admin/dashboard/opportunities', icon: HiOutlineBriefcase },
  { label: 'Reminders', to: '/admin/dashboard/reminders', icon: HiOutlineBell },
  { label: 'Profile', to: '/admin/dashboard/profile', icon: HiOutlineUserCircle },
];

export function AdminDashboardLayout() {
  return (
    <EmployeeProvider>
      <CustomerProvider>
        <OpportunityProvider>
          <ReminderProvider>
            <AdminMonitoringProvider>
              <QuickMessageProvider>
                <div className="dashboard-shell">
                  <ToolsFab />
                  <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-28 pt-5 md:px-6 md:pt-6">
                    <header className="dashboard-panel sticky top-4 z-20 mb-6">
                      <div className="flex items-center justify-between gap-4 px-5 py-4 md:px-7 md:py-5">
                        <div>
                          <p className="dashboard-kicker">Admin Workspace</p>
                          <h1 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                            Control Center
                          </h1>
                        </div>
                        <div className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800 md:block">
                          Team, leads, opportunities, and monitoring
                        </div>
                      </div>
                    </header>

                    <main className="flex-1">
                      <Outlet />
                    </main>

                    <DashboardBottomNav navItems={ADMIN_NAV} />
                  </div>
                </div>
              </QuickMessageProvider>
            </AdminMonitoringProvider>
          </ReminderProvider>
        </OpportunityProvider>
      </CustomerProvider>
    </EmployeeProvider>
  );
}
