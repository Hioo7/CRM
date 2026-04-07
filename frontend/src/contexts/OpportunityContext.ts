import { createContext } from 'react';
import type { Employee } from '@/types/auth';
import type {
  OpportunityListItem,
  OpportunityDetail,
  CreateOpportunityPayload,
  ChangeOpportunityStagePayload,
  GrantOpportunityAccessPayload,
} from '@/types/opportunity';

export interface OpportunityContextValue {
  opportunities: OpportunityListItem[];
  selectedOpportunity: OpportunityDetail | null;
  employeeOptions: Employee[];
  isLoading: boolean;
  isDetailLoading: boolean;
  isEmployeeOptionsLoading: boolean;
  error: string | null;
  fetchAll: (customerId?: string) => Promise<void>;
  fetchOpportunity: (id: string) => Promise<void>;
  fetchEmployeeOptions: () => Promise<void>;
  createOpportunity: (payload: CreateOpportunityPayload) => Promise<OpportunityListItem>;
  changeStage: (opportunityId: string, payload: ChangeOpportunityStagePayload) => Promise<void>;
  grantAccess: (opportunityId: string, payload: GrantOpportunityAccessPayload) => Promise<void>;
  revokeAccess: (opportunityId: string, employeeId: string) => Promise<void>;
}

export const OpportunityContext = createContext<OpportunityContextValue | null>(null);
