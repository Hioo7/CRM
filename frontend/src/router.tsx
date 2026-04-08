import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EmployeeDashboardLayout } from '@/layouts/EmployeeDashboardLayout';
import { AdminDashboardLayout } from '@/layouts/AdminDashboardLayout';
import { UsersPage } from '@/pages/super-admin/dashboard/UsersPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { LeadsPage } from '@/pages/employee/dashboard/LeadsPage';
import { CustomerDetailPage } from '@/pages/employee/dashboard/CustomerDetailPage';
import { OpportunitiesPage } from '@/pages/employee/dashboard/OpportunitiesPage';
import { OpportunityDetailPage } from '@/pages/employee/dashboard/OpportunityDetailPage';
import { RemindersPage } from '@/pages/employee/dashboard/RemindersPage';
import { OverviewPage } from '@/pages/admin/dashboard/OverviewPage';
import { TeamPage } from '@/pages/admin/dashboard/TeamPage';
import { EmployeeDetailPage } from '@/pages/admin/dashboard/EmployeeDetailPage';
import { AdminLeadsPage } from '@/pages/admin/dashboard/AdminLeadsPage';
import { AdminOpportunitiesPage } from '@/pages/admin/dashboard/AdminOpportunitiesPage';
import { QuickMessagesPage } from '@/pages/shared/QuickMessagesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
    children: [
      {
        path: '/super-admin/dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="users" replace />,
          },
          {
            path: 'users',
            element: <UsersPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'tools/quick-messages',
            element: <QuickMessagesPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '/admin/dashboard',
        element: <AdminDashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="overview" replace />,
          },
          {
            path: 'overview',
            element: <OverviewPage />,
          },
          {
            path: 'team',
            element: <TeamPage />,
          },
          {
            path: 'team/:employeeId',
            element: <EmployeeDetailPage />,
          },
          {
            path: 'leads',
            element: <AdminLeadsPage />,
          },
          {
            path: 'leads/:customerId',
            element: <CustomerDetailPage />,
          },
          {
            path: 'opportunities',
            element: <AdminOpportunitiesPage />,
          },
          {
            path: 'opportunities/:opportunityId',
            element: <OpportunityDetailPage />,
          },
          {
            path: 'reminders',
            element: <RemindersPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'tools/quick-messages',
            element: <QuickMessagesPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['EMPLOYEE']} />,
    children: [
      {
        path: '/employee/dashboard',
        element: <EmployeeDashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="leads" replace />,
          },
          {
            path: 'leads',
            element: <LeadsPage />,
          },
          {
            path: 'opportunities',
            element: <OpportunitiesPage />,
          },
          {
            path: 'opportunities/:opportunityId',
            element: <OpportunityDetailPage />,
          },
          {
            path: 'leads/:customerId',
            element: <CustomerDetailPage />,
          },
          {
            path: 'reminders',
            element: <RemindersPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'tools/quick-messages',
            element: <QuickMessagesPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
