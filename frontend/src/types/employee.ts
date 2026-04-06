import type { Employee, Role } from '@/types/auth';

export interface CreateEmployeePayload {
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE';
}

export interface UpdateEmployeePayload {
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'EMPLOYEE';
}

export interface UpdateSelfPayload {
  email?: string;
  password?: string;
}

export interface EmployeeDashboardRow {
  employee: Employee;
  canEdit: boolean;
  canDelete: boolean;
  lockReason: string | null;
  roleLabel: string;
  roleTone: 'primary' | 'secondary' | 'neutral';
}

export interface EmployeeActor {
  id: string;
  role: Role;
}
