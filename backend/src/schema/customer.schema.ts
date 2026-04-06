import { z } from 'zod';

const customerFields = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  company: z.string().min(1).max(255).optional(),
  notes: z.string().max(2000).optional(),
});

export const CreateCustomerSchema = customerFields;
export const UpdateCustomerSchema = customerFields.partial();

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
