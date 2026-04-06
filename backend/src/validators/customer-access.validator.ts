import { Request, Response, NextFunction } from 'express';
import { GrantCustomerAccessSchema } from '../schema/customer-access.schema';

export function validateGrantCustomerAccess(req: Request, res: Response, next: NextFunction): void {
  const result = GrantCustomerAccessSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
