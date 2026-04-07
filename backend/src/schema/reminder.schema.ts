import { z } from 'zod';

export const CreateReminderSchema = z.object({
  opportunityId: z.string().cuid(),
  description: z.string().min(1).max(1000),
  eventAt: z
    .string()
    .datetime()
    .refine((val) => new Date(val) > new Date(), {
      message: 'eventAt must be a future datetime',
    }),
  notifyBefore: z.number().int().min(1),
});

export type CreateReminderDto = z.infer<typeof CreateReminderSchema>;

export const ListRemindersQuerySchema = z.object({
  opportunityId: z.string().cuid().optional(),
  completed: z.enum(['true', 'false']).optional(),
});

export type ListRemindersQueryDto = z.infer<typeof ListRemindersQuerySchema>;

export const ReminderIdParamSchema = z.object({
  id: z.string().cuid(),
});

export type ReminderIdParamDto = z.infer<typeof ReminderIdParamSchema>;
