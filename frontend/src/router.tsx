import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { UsersPage } from '@/pages/super-admin/dashboard/UsersPage';
import { ProfilePage } from '@/pages/super-admin/dashboard/ProfilePage';

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
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
