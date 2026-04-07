import { Request, Response, NextFunction } from 'express';
import { ReminderService } from '../services/ReminderService';
import { CreateReminderDto, ListRemindersQueryDto } from '../schema/reminder.schema';

type IdParam = { id: string };

export class ReminderController {
  private static instance: ReminderController;

  private constructor() {}

  static getInstance(): ReminderController {
    if (!ReminderController.instance) {
      ReminderController.instance = new ReminderController();
    }
    return ReminderController.instance;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateReminderDto;
      const reminder = await ReminderService.getInstance().createReminder(
        req.employee.id,
        req.employee.role,
        dto,
      );
      res.status(201).json(reminder);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as ListRemindersQueryDto;
      const reminders = await ReminderService.getInstance().listReminders(req.employee.id, query);
      res.status(200).json(reminders);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const reminder = await ReminderService.getInstance().findById(req.params.id);
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  };

  markComplete = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const reminder = await ReminderService.getInstance().markComplete(req.params.id);
      res.status(200).json(reminder);
    } catch (error) {
      next(error);
    }
  };
}
