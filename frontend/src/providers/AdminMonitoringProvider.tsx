import { useState, useCallback, type ReactNode } from 'react';
import { AdminMonitoringContext } from '@/contexts/AdminMonitoringContext';
import { adminService } from '@/services/adminService';
import type { AdminOverview, ActivityEntry } from '@/types/admin';

interface AdminMonitoringProviderProps {
  children: ReactNode;
}

export function AdminMonitoringProvider({ children }: AdminMonitoringProviderProps) {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityEntry[]>([]);
  const [employeeActivity, setEmployeeActivity] = useState<ActivityEntry[]>([]);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isActivityLoading, setIsActivityLoading] = useState(false);
  const [isEmployeeActivityLoading, setIsEmployeeActivityLoading] = useState(false);

  const fetchOverview = useCallback(async (): Promise<void> => {
    setIsOverviewLoading(true);
    try {
      const data = await adminService.getOverview();
      setOverview(data);
    } finally {
      setIsOverviewLoading(false);
    }
  }, []);

  const fetchRecentActivity = useCallback(async (): Promise<void> => {
    setIsActivityLoading(true);
    try {
      const data = await adminService.getRecentActivity();
      setRecentActivity(data);
    } finally {
      setIsActivityLoading(false);
    }
  }, []);

  const fetchEmployeeActivity = useCallback(async (employeeId: string): Promise<void> => {
    setIsEmployeeActivityLoading(true);
    setEmployeeActivity([]);
    try {
      const data = await adminService.getEmployeeActivity(employeeId);
      setEmployeeActivity(data);
    } finally {
      setIsEmployeeActivityLoading(false);
    }
  }, []);

  return (
    <AdminMonitoringContext.Provider
      value={{
        overview,
        recentActivity,
        employeeActivity,
        isOverviewLoading,
        isActivityLoading,
        isEmployeeActivityLoading,
        fetchOverview,
        fetchRecentActivity,
        fetchEmployeeActivity,
      }}
    >
      {children}
    </AdminMonitoringContext.Provider>
  );
}
