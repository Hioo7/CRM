import { z } from 'zod';

export const GrantOpportunityAccessSchema = z.object({
  employeeId: z.string().cuid(),
  accessType: z.enum(['READ_ONLY', 'READ_WRITE']),
});

export type GrantOpportunityAccessDto = z.infer<typeof GrantOpportunityAccessSchema>;
