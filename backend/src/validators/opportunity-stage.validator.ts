import { Request, Response, NextFunction } from 'express';
import { StageChangeSchema } from '../schema/opportunity-stage.schema';

export function validateStageChange(req: Request, res: Response, next: NextFunction): void {
  const result = StageChangeSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
