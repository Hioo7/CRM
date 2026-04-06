import { useState, useCallback, type ReactNode } from 'react';
import { EmployeeContext } from '@/contexts/EmployeeContext';
import { employeeService } from '@/services/employeeService';
import { extractApiErrorMessage } from '@/utils/errors';
import type { Employee } from '@/types/auth';
import type { CreateEmployeePayload, UpdateEmployeePayload } from '@/types/employee';

interface EmployeeProviderProps {
  children: ReactNode;
}

export function EmployeeProvider({ children }: EmployeeProviderProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await employeeService.listAll();
      setEmployees(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEmployee = useCallback(async (payload: CreateEmployeePayload): Promise<void> => {
    const created = await employeeService.create(payload);
    setEmployees((prev) => [created, ...prev]);
  }, []);

  const updateEmployee = useCallback(async (id: string, payload: UpdateEmployeePayload): Promise<void> => {
    const updated = await employeeService.update(id, payload);
    setEmployees((prev) => prev.map((e) => (e.id === id ? updated : e)));
  }, []);

  const deleteEmployee = useCallback(async (id: string): Promise<void> => {
    await employeeService.remove(id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <EmployeeContext.Provider value={{ employees, isLoading, error, fetchAll, createEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}
