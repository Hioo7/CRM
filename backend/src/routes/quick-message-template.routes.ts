import { Router } from 'express';
import { Role } from '@prisma/client';
import { QuickMessageTemplateController } from '../controllers/QuickMessageTemplateController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import {
  validateCreateQuickMessageTemplate,
  validateQuickMessageTemplateListQuery,
  validateRenderQuickMessageTemplate,
  validateUpdateQuickMessageTemplate,
} from '../validators/quick-message-template.validator';

const router = Router();
const controller = QuickMessageTemplateController.getInstance();

router.get(
  '/meta',
  authenticate,
  controller.getMetadata,
);

router.get(
  '/',
  authenticate,
  validateQuickMessageTemplateListQuery,
  controller.list,
);

router.get(
  '/:id',
  authenticate,
  controller.getById,
);

router.post(
  '/render',
  authenticate,
  validateRenderQuickMessageTemplate,
  controller.render,
);

router.post(
  '/',
  authenticate,
  authorize(Role.ADMIN, Role.SUPER_ADMIN),
  validateCreateQuickMessageTemplate,
  controller.create,
);

router.patch(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.SUPER_ADMIN),
  validateUpdateQuickMessageTemplate,
  controller.update,
);

router.delete(
  '/:id',
  authenticate,
  authorize(Role.ADMIN, Role.SUPER_ADMIN),
  controller.delete,
);

export default router;
