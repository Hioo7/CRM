import { useContext } from 'react';
import { CustomerContext } from '@/contexts/CustomerContext';

export function useCustomers() {
  const ctx = useContext(CustomerContext);
  if (!ctx) {
    throw new Error('useCustomers must be used within CustomerProvider');
  }
  return ctx;
}
