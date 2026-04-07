import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { CustomerContext } from '@/contexts/CustomerContext';
import { customerService } from '@/services/customerService';
import { extractApiErrorMessage } from '@/utils/errors';
import type {
  CustomerListItem,
  CustomerDetail,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  GrantAccessPayload,
} from '@/types/customer';

interface CustomerProviderProps {
  children: ReactNode;
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await customerService.list();
      setCustomers(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCustomer = useCallback(async (id: string): Promise<void> => {
    setSelectedCustomer(null);
    setIsDetailLoading(true);
    setError(null);
    try {
      const data = await customerService.getById(id);
      setSelectedCustomer(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsDetailLoading(false);
    }
  }, []);

  const createCustomer = useCallback(async (payload: CreateCustomerPayload): Promise<CustomerListItem> => {
    const created = await customerService.create(payload);
    setCustomers((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateCustomer = useCallback(async (id: string, payload: UpdateCustomerPayload): Promise<void> => {
    const updated = await customerService.update(id, payload);
    setSelectedCustomer(updated);
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...updated, customerAccesses: c.customerAccesses }
          : c,
      ),
    );
  }, []);

  const grantAccess = useCallback(async (customerId: string, payload: GrantAccessPayload): Promise<void> => {
    const entry = await customerService.grantAccess(customerId, payload);
    setSelectedCustomer((prev) => {
      if (!prev || prev.id !== customerId) return prev;
      const existing = prev.customerAccesses.findIndex((a) => a.employeeId === entry.employeeId);
      const updated =
        existing >= 0
          ? prev.customerAccesses.map((a, i) => (i === existing ? entry : a))
          : [...prev.customerAccesses, entry];
      return { ...prev, customerAccesses: updated };
    });
  }, []);

  const revokeAccess = useCallback(async (customerId: string, employeeId: string): Promise<void> => {
    await customerService.revokeAccess(customerId, employeeId);
    setSelectedCustomer((prev) => {
      if (!prev || prev.id !== customerId) return prev;
      return {
        ...prev,
        customerAccesses: prev.customerAccesses.filter((a) => a.employeeId !== employeeId),
      };
    });
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        selectedCustomer,
        isLoading,
        isDetailLoading,
        error,
        fetchAll,
        fetchCustomer,
        createCustomer,
        updateCustomer,
        grantAccess,
        revokeAccess,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}
