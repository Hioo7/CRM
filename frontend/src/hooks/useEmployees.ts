import { useContext } from 'react';
import { EmployeeContext, type EmployeeContextValue } from '@/contexts/EmployeeContext';

export function useEmployees(): EmployeeContextValue {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used within EmployeeProvider');
  return ctx;
}
