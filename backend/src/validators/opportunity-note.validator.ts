import { Request, Response, NextFunction } from 'express';
import { NoteEditSchema } from '../schema/opportunity-note.schema';

export function validateNoteEdit(req: Request, res: Response, next: NextFunction): void {
  const result = NoteEditSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error.flatten().fieldErrors });
    return;
  }
  req.body = result.data;
  next();
}
