import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { EmployeeDashboardLayout } from '@/layouts/EmployeeDashboardLayout';
import { UsersPage } from '@/pages/super-admin/dashboard/UsersPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { LeadsPage } from '@/pages/employee/dashboard/LeadsPage';
import { CustomerDetailPage } from '@/pages/employee/dashboard/CustomerDetailPage';
import { OpportunitiesPage } from '@/pages/employee/dashboard/OpportunitiesPage';
import { OpportunityDetailPage } from '@/pages/employee/dashboard/OpportunityDetailPage';
import { RemindersPage } from '@/pages/employee/dashboard/RemindersPage';

export const router = createBrowserRouter([
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
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
