import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import meRoutes from './me.routes';
import customerRoutes from './customer.routes';
import opportunityRoutes from './opportunity.routes';
import reminderRoutes from './reminder.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/me', meRoutes);
router.use('/customers', customerRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/reminders', reminderRoutes);

export default router;
