import { z } from 'zod';
import { Role } from '@prisma/client';

export const CreateEmployeeSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).default(Role.EMPLOYEE),
});

export const UpdateEmployeeSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.nativeEnum(Role).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided' },
);

export const UpdateSelfSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
}).refine(
  (data) => data.email !== undefined || data.password !== undefined,
  { message: 'At least one field must be provided' },
);

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeSchema>;
export type UpdateEmployeeDto = z.infer<typeof UpdateEmployeeSchema>;
export type UpdateSelfDto = z.infer<typeof UpdateSelfSchema>;
