import { Router } from 'express';
import { MeController } from '../controllers/MeController';
import { authenticate } from '../middleware/authenticate';
import { validateUpdateSelf } from '../validators/employee.validator';

const router = Router();
const controller = MeController.getInstance();

router.get('/', authenticate, controller.getProfile);
router.patch('/', authenticate, validateUpdateSelf, controller.updateProfile);

export default router;
