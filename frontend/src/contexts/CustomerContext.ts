import { createContext } from 'react';
import type {
  CustomerListItem,
  CustomerDetail,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  GrantAccessPayload,
} from '@/types/customer';

export interface CustomerContextValue {
  customers: CustomerListItem[];
  selectedCustomer: CustomerDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchCustomer: (id: string) => Promise<void>;
  createCustomer: (payload: CreateCustomerPayload) => Promise<CustomerListItem>;
  updateCustomer: (id: string, payload: UpdateCustomerPayload) => Promise<void>;
  grantAccess: (customerId: string, payload: GrantAccessPayload) => Promise<void>;
  revokeAccess: (customerId: string, employeeId: string) => Promise<void>;
}

export const CustomerContext = createContext<CustomerContextValue | null>(null);
