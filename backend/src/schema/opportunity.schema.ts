import { z } from 'zod';

const OPPORTUNITY_STAGES = [
  'LEAD',
  'QUALIFIED_LEAD',
  'NEEDS_ANALYSIS',
  'PROPOSAL_DEMO',
  'NEGOTIATION',
  'CLOSED_WON',
  'ONBOARDING',
  'ACTIVE_RETENTION',
  'CHURNED_CLOSED_LOST',
] as const;

export const OpportunityStageEnum = z.enum(OPPORTUNITY_STAGES);

export const CreateOpportunitySchema = z.object({
  name: z.string().min(1).max(255),
  customerId: z.string().cuid(),
});

export const UpdateOpportunitySchema = z.object({
  name: z.string().min(1).max(255),
});

export type CreateOpportunityDto = z.infer<typeof CreateOpportunitySchema>;
export type UpdateOpportunityDto = z.infer<typeof UpdateOpportunitySchema>;
