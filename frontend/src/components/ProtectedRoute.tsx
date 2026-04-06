import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import type { Role } from '@/types/auth';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { employee, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!employee) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(employee.role)) return <Navigate to="/login" replace />;

  return <Outlet />;
}
