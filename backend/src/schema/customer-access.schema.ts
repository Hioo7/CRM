import { z } from 'zod';
import { AccessType } from '@prisma/client';

export const GrantCustomerAccessSchema = z.object({
  employeeId: z.string().cuid(),
  accessType: z.nativeEnum(AccessType),
});

export type GrantCustomerAccessDto = z.infer<typeof GrantCustomerAccessSchema>;
