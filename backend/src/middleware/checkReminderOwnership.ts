import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';

export async function checkReminderOwnership(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const reminderId = req.params.id as string;
  const employeeId = req.employee.id;

  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
  });

  if (!reminder) {
    next(new AppError(404, 'Reminder not found'));
    return;
  }

  if (reminder.employeeId !== employeeId) {
    next(new AppError(403, 'You do not own this reminder'));
    return;
  }

  next();
}
