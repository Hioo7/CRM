import { z } from 'zod';

export const NoteEditSchema = z.object({
  notes: z.string().max(5000).nullable(),
});

export type NoteEditDto = z.infer<typeof NoteEditSchema>;
