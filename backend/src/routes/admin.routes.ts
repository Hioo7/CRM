import { Router } from 'express';
import { Role } from '@prisma/client';
import { AdminController } from '../controllers/AdminController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';

const router = Router();
const controller = AdminController.getInstance();

router.get(
  '/overview',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.getOverview,
);

router.get(
  '/activity',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.getRecentActivity,
);

router.get(
  '/employees/:id/activity',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.getEmployeeActivity,
);

export default router;
