import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AppError } from '../lib/AppError';

export function authorize(...allowedRoles: Role[]): (req: Request, _res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!allowedRoles.includes(req.employee.role)) {
      return next(new AppError(403, 'Forbidden'));
    }
    next();
  };
}
