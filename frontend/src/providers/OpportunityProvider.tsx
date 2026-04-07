import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { OpportunityContext } from '@/contexts/OpportunityContext';
import { opportunityService, isInitialOpportunityStage } from '@/services/opportunityService';
import { employeeService } from '@/services/employeeService';
import { extractApiErrorMessage } from '@/utils/errors';
import type { Employee } from '@/types/auth';
import type {
  OpportunityListItem,
  OpportunityDetail,
  CreateOpportunityPayload,
  ChangeOpportunityStagePayload,
  GrantOpportunityAccessPayload,
  OpportunityAccessEntry,
} from '@/types/opportunity';

interface OpportunityProviderProps {
  children: ReactNode;
}

function toListItem(detail: OpportunityDetail): OpportunityListItem {
  return {
    id: detail.id,
    name: detail.name,
    customerId: detail.customerId,
    createdById: detail.createdById,
    stage: detail.stage,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
    customer: detail.customer,
    createdBy: detail.createdBy,
    accesses: detail.accesses.map((access) => ({
      employeeId: access.employeeId,
      accessType: access.accessType,
    })),
  };
}

export function OpportunityProvider({ children }: OpportunityProviderProps) {
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityDetail | null>(null);
  const [employeeOptions, setEmployeeOptions] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isEmployeeOptionsLoading, setIsEmployeeOptionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upsertListItem = useCallback((item: OpportunityListItem): void => {
    setOpportunities((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.id === item.id);
      if (existingIndex < 0) {
        return [item, ...prev];
      }

      const updated = [...prev];
      updated[existingIndex] = item;
      return updated;
    });
  }, []);

  const fetchAll = useCallback(async (customerId?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await opportunityService.list(customerId);
      setOpportunities(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOpportunity = useCallback(async (id: string): Promise<void> => {
    setSelectedOpportunity(null);
    setIsDetailLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getById(id);
      setSelectedOpportunity(data);
      upsertListItem(toListItem(data));
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsDetailLoading(false);
    }
  }, [upsertListItem]);

  const fetchEmployeeOptions = useCallback(async (): Promise<void> => {
    setIsEmployeeOptionsLoading(true);
    try {
      const data = await employeeService.listAll();
      setEmployeeOptions(data.filter((employee) => employee.role === 'EMPLOYEE'));
    } catch {
      setEmployeeOptions([]);
    } finally {
      setIsEmployeeOptionsLoading(false);
    }
  }, []);

  const createOpportunity = useCallback(async (payload: CreateOpportunityPayload): Promise<OpportunityListItem> => {
    const created = await opportunityService.create(payload);

    if (isInitialOpportunityStage(payload.stage)) {
      upsertListItem(created);
      return created;
    }

    const updated = await opportunityService.changeStage(created.id, {
      toStage: payload.stage,
    });
    const listItem = toListItem(updated);
    upsertListItem(listItem);
    return listItem;
  }, [upsertListItem]);

  const changeStage = useCallback(async (
    opportunityId: string,
    payload: ChangeOpportunityStagePayload,
  ): Promise<void> => {
    const updated = await opportunityService.changeStage(opportunityId, payload);
    setSelectedOpportunity(updated);
    upsertListItem(toListItem(updated));
  }, [upsertListItem]);

  const grantAccess = useCallback(async (
    opportunityId: string,
    payload: GrantOpportunityAccessPayload,
  ): Promise<void> => {
    const access = await opportunityService.grantAccess(opportunityId, payload);
    setSelectedOpportunity((prev) => {
      if (!prev || prev.id !== opportunityId) {
        return prev;
      }

      const existingIndex = prev.accesses.findIndex((entry) => entry.employeeId === access.employeeId);
      const nextAccesses: OpportunityAccessEntry[] =
        existingIndex >= 0
          ? prev.accesses.map((entry, index) => (index === existingIndex ? access : entry))
          : [...prev.accesses, access];
      const updatedDetail = { ...prev, accesses: nextAccesses };
      upsertListItem(toListItem(updatedDetail));
      return updatedDetail;
    });
  }, [upsertListItem]);

  const revokeAccess = useCallback(async (opportunityId: string, employeeId: string): Promise<void> => {
    await opportunityService.revokeAccess(opportunityId, employeeId);
    setSelectedOpportunity((prev) => {
      if (!prev || prev.id !== opportunityId) {
        return prev;
      }

      const updatedDetail = {
        ...prev,
        accesses: prev.accesses.filter((entry) => entry.employeeId !== employeeId),
      };
      upsertListItem(toListItem(updatedDetail));
      return updatedDetail;
    });
  }, [upsertListItem]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <OpportunityContext.Provider
      value={{
        opportunities,
        selectedOpportunity,
        employeeOptions,
        isLoading,
        isDetailLoading,
        isEmployeeOptionsLoading,
        error,
        fetchAll,
        fetchOpportunity,
        fetchEmployeeOptions,
        createOpportunity,
        changeStage,
        grantAccess,
        revokeAccess,
      }}
    >
      {children}
    </OpportunityContext.Provider>
  );
}
