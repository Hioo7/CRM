import { createContext } from 'react';
import type { AdminOverview, ActivityEntry } from '@/types/admin';

export interface AdminMonitoringContextValue {
  overview: AdminOverview | null;
  recentActivity: ActivityEntry[];
  employeeActivity: ActivityEntry[];
  isOverviewLoading: boolean;
  isActivityLoading: boolean;
  isEmployeeActivityLoading: boolean;
  fetchOverview: () => Promise<void>;
  fetchRecentActivity: () => Promise<void>;
  fetchEmployeeActivity: (employeeId: string) => Promise<void>;
}

export const AdminMonitoringContext = createContext<AdminMonitoringContextValue | null>(null);
