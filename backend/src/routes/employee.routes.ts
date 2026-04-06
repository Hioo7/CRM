import { Router } from 'express';
import { Role } from '@prisma/client';
import { EmployeeController } from '../controllers/EmployeeController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  validateCreateEmployee,
  validateUpdateEmployee,
} from '../validators/employee.validator';

const router = Router();
const controller = EmployeeController.getInstance();

router.post(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN),
  validateCreateEmployee,
  controller.create,
);

router.get(
  '/',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.list,
);

router.get(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.getById,
);

router.patch(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  validateUpdateEmployee,
  controller.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.SUPER_ADMIN, Role.ADMIN),
  controller.remove,
);

export default router;
