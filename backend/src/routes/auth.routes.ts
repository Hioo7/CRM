import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateLogin } from '../validators/auth.validator';

const router = Router();
const controller = AuthController.getInstance();

router.post('/login', validateLogin, controller.login);

export default router;
