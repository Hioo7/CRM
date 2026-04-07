import { Router } from 'express';
import { ReminderController } from '../controllers/ReminderController';
import { authenticate } from '../middleware/authenticate';
import { checkReminderOwnership } from '../middleware/checkReminderOwnership';
import {
  validateCreateReminder,
  validateListRemindersQuery,
  validateReminderIdParam,
} from '../validators/reminder.validator';

const router = Router();
const controller = ReminderController.getInstance();

router.post('/', authenticate, validateCreateReminder, controller.create);
router.get('/', authenticate, validateListRemindersQuery, controller.list);
router.get('/:id', authenticate, validateReminderIdParam, checkReminderOwnership, controller.getById);
router.patch('/:id/complete', authenticate, validateReminderIdParam, checkReminderOwnership, controller.markComplete);

export default router;
