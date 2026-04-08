import { useContext } from 'react';
import {
  AdminMonitoringContext,
  type AdminMonitoringContextValue,
} from '@/contexts/AdminMonitoringContext';

export function useAdminMonitoring(): AdminMonitoringContextValue {
  const ctx = useContext(AdminMonitoringContext);
  if (!ctx) {
    throw new Error('useAdminMonitoring must be used within AdminMonitoringProvider');
  }
  return ctx;
}
