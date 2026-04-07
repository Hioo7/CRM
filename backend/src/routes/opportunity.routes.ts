import { Router } from 'express';
import { Role } from '@prisma/client';
import { AccessType } from '@prisma/client';
import { OpportunityController } from '../controllers/OpportunityController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { checkOpportunityAccess } from '../middleware/checkOpportunityAccess';
import {
  validateCreateOpportunity,
  validateUpdateOpportunity,
} from '../validators/opportunity.validator';
import { validateStageChange } from '../validators/opportunity-stage.validator';
import { validateNoteEdit } from '../validators/opportunity-note.validator';
import { validateGrantOpportunityAccess } from '../validators/opportunity-access.validator';

const router = Router();
const controller = OpportunityController.getInstance();

router.post('/', authenticate, validateCreateOpportunity, controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, checkOpportunityAccess(AccessType.READ_ONLY), controller.getById);
router.patch('/:id', authenticate, checkOpportunityAccess(AccessType.READ_WRITE), validateUpdateOpportunity, controller.update);
router.delete('/:id', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), controller.delete);
router.post('/:id/stage', authenticate, checkOpportunityAccess(AccessType.READ_WRITE), validateStageChange, controller.changeStage);
router.patch('/:id/history/:historyId/notes', authenticate, checkOpportunityAccess(AccessType.READ_WRITE), validateNoteEdit, controller.editNotes);
router.post('/:id/access', authenticate, checkOpportunityAccess(AccessType.READ_WRITE), validateGrantOpportunityAccess, controller.grantAccess);
router.delete('/:id/access/:employeeId', authenticate, checkOpportunityAccess(AccessType.READ_WRITE), controller.revokeAccess);

export default router;
