import { Request, Response, NextFunction } from 'express';
import {
  CreateReminderSchema,
  ListRemindersQuerySchema,
  ReminderIdParamSchema,
} from '../schema/reminder.schema';

export function validateCreateReminder(req: Request, res: Response, next: NextFunction): void {
  const result = CreateReminderSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}

export function validateListRemindersQuery(req: Request, res: Response, next: NextFunction): void {
  const result = ListRemindersQuerySchema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  next();
}

export function validateReminderIdParam(req: Request, res: Response, next: NextFunction): void {
  const result = ReminderIdParamSchema.safeParse(req.params);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  next();
}
