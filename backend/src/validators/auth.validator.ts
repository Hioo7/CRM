import { Request, Response, NextFunction } from 'express';
import { LoginSchema } from '../schema/auth.schema';

export function validateLogin(req: Request, res: Response, next: NextFunction): void {
  const result = LoginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
