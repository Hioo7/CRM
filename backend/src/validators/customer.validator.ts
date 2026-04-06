import { Request, Response, NextFunction } from 'express';
import { CreateCustomerSchema, UpdateCustomerSchema } from '../schema/customer.schema';

export function validateCreateCustomer(req: Request, res: Response, next: NextFunction): void {
  const result = CreateCustomerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}

export function validateUpdateCustomer(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateCustomerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
