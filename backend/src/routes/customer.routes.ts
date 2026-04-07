import { Router } from 'express';
import { Role } from '@prisma/client';
import { AccessType } from '@prisma/client';
import { CustomerController } from '../controllers/CustomerController';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { checkCustomerAccess } from '../middleware/checkCustomerAccess';
import { validateCreateCustomer, validateUpdateCustomer } from '../validators/customer.validator';
import { validateGrantCustomerAccess } from '../validators/customer-access.validator';

const router = Router();
const controller = CustomerController.getInstance();

router.post('/', authenticate, validateCreateCustomer, controller.create);
router.get('/', authenticate, controller.list);
router.get('/:id', authenticate, checkCustomerAccess(AccessType.READ_ONLY), controller.getById);
router.patch('/:id', authenticate, checkCustomerAccess(AccessType.READ_WRITE), validateUpdateCustomer, controller.update);
router.delete('/:id', authenticate, authorize(Role.ADMIN, Role.SUPER_ADMIN), controller.delete);
router.post('/:id/access', authenticate, checkCustomerAccess(AccessType.READ_WRITE), validateGrantCustomerAccess, controller.grantAccess);
router.delete('/:id/access/:employeeId', authenticate, checkCustomerAccess(AccessType.READ_WRITE), controller.revokeAccess);

export default router;
