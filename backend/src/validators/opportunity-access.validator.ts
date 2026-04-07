import { Request, Response, NextFunction } from 'express';
import { GrantOpportunityAccessSchema } from '../schema/opportunity-access.schema';

export function validateGrantOpportunityAccess(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = GrantOpportunityAccessSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
