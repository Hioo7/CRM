import httpClient from './httpClient';
import type {
  OpportunityListItem,
  OpportunityDetail,
  CreateOpportunityPayload,
  ChangeOpportunityStagePayload,
  GrantOpportunityAccessPayload,
  OpportunityAccessEntry,
  OpportunityStage,
} from '@/types/opportunity';

interface CreateOpportunityRequest {
  customerId: string;
  name: string;
}

export const opportunityService = {
  async list(customerId?: string): Promise<OpportunityListItem[]> {
    const { data } = await httpClient.get<OpportunityListItem[]>('/opportunities', {
      params: customerId ? { customerId } : undefined,
    });
    return data;
  },

  async getById(id: string): Promise<OpportunityDetail> {
    const { data } = await httpClient.get<OpportunityDetail>(`/opportunities/${id}`);
    return data;
  },

  async create(payload: CreateOpportunityPayload): Promise<OpportunityListItem> {
    const request: CreateOpportunityRequest = {
      customerId: payload.customerId,
      name: payload.name,
    };
    const { data } = await httpClient.post<OpportunityListItem>('/opportunities', request);
    return data;
  },

  async changeStage(
    opportunityId: string,
    payload: ChangeOpportunityStagePayload,
  ): Promise<OpportunityDetail> {
    const { data } = await httpClient.post<OpportunityDetail>(
      `/opportunities/${opportunityId}/stage`,
      payload,
    );
    return data;
  },

  async grantAccess(
    opportunityId: string,
    payload: GrantOpportunityAccessPayload,
  ): Promise<OpportunityAccessEntry> {
    const { data } = await httpClient.post<OpportunityAccessEntry>(
      `/opportunities/${opportunityId}/access`,
      payload,
    );
    return data;
  },

  async revokeAccess(opportunityId: string, employeeId: string): Promise<void> {
    await httpClient.delete(`/opportunities/${opportunityId}/access/${employeeId}`);
  },
};

export function isInitialOpportunityStage(stage: OpportunityStage): boolean {
  return stage === 'LEAD';
}
