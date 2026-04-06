import { Request, Response, NextFunction } from 'express';
import { CreateEmployeeSchema, UpdateEmployeeSchema, UpdateSelfSchema } from '../schema/employee.schema';

export function validateCreateEmployee(req: Request, res: Response, next: NextFunction): void {
  const result = CreateEmployeeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}

export function validateUpdateEmployee(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateEmployeeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}

export function validateUpdateSelf(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateSelfSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
