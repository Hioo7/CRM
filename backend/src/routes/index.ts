import { Router } from 'express';
import authRoutes from './auth.routes';
import employeeRoutes from './employee.routes';
import meRoutes from './me.routes';
import customerRoutes from './customer.routes';
import opportunityRoutes from './opportunity.routes';
import reminderRoutes from './reminder.routes';
import adminRoutes from './admin.routes';
import quickMessageTemplateRoutes from './quick-message-template.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/me', meRoutes);
router.use('/customers', customerRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/reminders', reminderRoutes);
router.use('/admin', adminRoutes);
router.use('/quick-message-templates', quickMessageTemplateRoutes);

export default router;
