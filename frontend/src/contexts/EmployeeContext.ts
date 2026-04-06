import { createContext } from 'react';
import type { Employee } from '@/types/auth';
import type { CreateEmployeePayload, UpdateEmployeePayload } from '@/types/employee';

export interface EmployeeContextValue {
  employees: Employee[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  createEmployee: (payload: CreateEmployeePayload) => Promise<void>;
  updateEmployee: (id: string, payload: UpdateEmployeePayload) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
}

export const EmployeeContext = createContext<EmployeeContextValue | null>(null);
