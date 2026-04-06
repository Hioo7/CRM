import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import meRoutes from './me.routes';
import customerRoutes from './customer.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/me', meRoutes);
router.use('/customers', customerRoutes);

export default router;
