import { z } from 'zod';
import { OpportunityStageEnum } from './opportunity.schema';

export const StageChangeSchema = z.object({
  toStage: OpportunityStageEnum,
  notes: z.string().max(5000).optional(),
});

export type StageChangeDto = z.infer<typeof StageChangeSchema>;
