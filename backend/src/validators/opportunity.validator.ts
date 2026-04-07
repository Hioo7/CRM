import { Request, Response, NextFunction } from 'express';
import { CreateOpportunitySchema, UpdateOpportunitySchema } from '../schema/opportunity.schema';

export function validateCreateOpportunity(req: Request, res: Response, next: NextFunction): void {
  const result = CreateOpportunitySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}

export function validateUpdateOpportunity(req: Request, res: Response, next: NextFunction): void {
  const result = UpdateOpportunitySchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
