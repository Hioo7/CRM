import { Request, Response, NextFunction } from 'express';
import { AccessType, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';

export function checkCustomerAccess(
  requiredAccess: AccessType,
): (req: Request, _res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const { role, id: employeeId } = req.employee;

    if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
      next();
      return;
    }

    const customerId = req.params.id as string;
    const access = await prisma.customerAccess.findUnique({
      where: { customerId_employeeId: { customerId, employeeId } },
    });

    if (!access) {
      return next(new AppError(403, 'You do not have access to this customer'));
    }

    if (requiredAccess === AccessType.READ_WRITE && access.accessType === AccessType.READ_ONLY) {
      return next(new AppError(403, 'Read-only access: cannot modify this customer'));
    }

    next();
  };
}
