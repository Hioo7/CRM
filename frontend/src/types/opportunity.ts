import type { AccessType, CustomerAccessEmployee } from '@/types/customer';

export type OpportunityStage =
  | 'LEAD'
  | 'QUALIFIED_LEAD'
  | 'NEEDS_ANALYSIS'
  | 'PROPOSAL_DEMO'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'ONBOARDING'
  | 'ACTIVE_RETENTION'
  | 'CHURNED_CLOSED_LOST';

export interface OpportunityCustomerSummary {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
}

export interface OpportunityCreatedBy {
  id: string;
  username: string;
}

export interface OpportunityListAccess {
  employeeId: string;
  accessType: AccessType;
}

export interface OpportunityAccessEntry {
  id: string;
  employeeId: string;
  accessType: AccessType;
  employee: CustomerAccessEmployee;
}

export interface OpportunityNoteEdit {
  id: string;
  previousNotes: string | null;
  newNotes: string | null;
  editedAt: string;
  editedBy: OpportunityCreatedBy;
}

export interface OpportunityStageHistoryEntry {
  id: string;
  fromStage: OpportunityStage | null;
  toStage: OpportunityStage;
  notes: string | null;
  changedAt: string;
  changedBy: OpportunityCreatedBy;
  noteEdits: OpportunityNoteEdit[];
}

export interface OpportunityListItem {
  id: string;
  name: string;
  customerId: string;
  createdById: string;
  stage: OpportunityStage;
  createdAt: string;
  updatedAt: string;
  customer: OpportunityCustomerSummary;
  createdBy: OpportunityCreatedBy;
  accesses: OpportunityListAccess[];
}

export interface OpportunityDetail extends Omit<OpportunityListItem, 'accesses'> {
  accesses: OpportunityAccessEntry[];
  stageHistory: OpportunityStageHistoryEntry[];
}

export interface CreateOpportunityPayload {
  customerId: string;
  name: string;
  stage: OpportunityStage;
}

export interface ChangeOpportunityStagePayload {
  toStage: OpportunityStage;
  notes?: string;
}

export interface GrantOpportunityAccessPayload {
  employeeId: string;
  accessType: AccessType;
}
