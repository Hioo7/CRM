import { Request, Response, NextFunction } from 'express';
import {
  CreateQuickMessageTemplateSchema,
  QuickMessageTemplateListQuerySchema,
  RenderQuickMessageTemplateSchema,
  UpdateQuickMessageTemplateSchema,
} from '../schema/quick-message-template.schema';

export function validateCreateQuickMessageTemplate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = CreateQuickMessageTemplateSchema.safeParse(req.body);
  if (!result.success) {
    const flattened = result.error.flatten();
    res.status(400).json({
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
      message: 'Invalid quick message template payload',
    });
    return;
  }

  req.body = result.data;
  next();
}

export function validateUpdateQuickMessageTemplate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = UpdateQuickMessageTemplateSchema.safeParse(req.body);
  if (!result.success) {
    const flattened = result.error.flatten();
    res.status(400).json({
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
      message: 'Invalid quick message template payload',
    });
    return;
  }

  req.body = result.data;
  next();
}

export function validateQuickMessageTemplateListQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = QuickMessageTemplateListQuerySchema.safeParse(req.query);
  if (!result.success) {
    const flattened = result.error.flatten();
    res.status(400).json({
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
      message: 'Invalid quick message template query',
    });
    return;
  }
  next();
}

export function validateRenderQuickMessageTemplate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = RenderQuickMessageTemplateSchema.safeParse(req.body);
  if (!result.success) {
    const flattened = result.error.flatten();
    res.status(400).json({
      errors: flattened.fieldErrors,
      formErrors: flattened.formErrors,
      message: 'Invalid quick message template render payload',
    });
    return;
  }

  req.body = result.data;
  next();
}
