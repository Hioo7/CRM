import type { OpportunityStage } from '@/types/opportunity';

export interface AdminOverview {
  employeeCount: number;
  customerCount: number;
  openOpportunityCount: number;
  closedWonCount: number;
  opportunitiesByStage: AdminStageCount[];
}

export interface AdminStageCount {
  stage: OpportunityStage;
  count: number;
}

export interface ActivityNoteEdit {
  id: string;
  previousNotes: string;
  newNotes: string;
  editedAt: string;
  editedBy: { id: string; username: string };
}

export interface ActivityEntry {
  id: string;
  opportunityId: string;
  opportunityName: string;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
  };
  fromStage: OpportunityStage | null;
  toStage: OpportunityStage;
  notes: string | null;
  changedAt: string;
  changedBy: { id: string; username: string };
  noteEdits: ActivityNoteEdit[];
}
