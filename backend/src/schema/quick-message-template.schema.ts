import { SocialPlatform } from '@prisma/client';
import { z } from 'zod';
import {
  QUICK_MESSAGE_PLACEHOLDER_PATTERN,
  QUICK_MESSAGE_TEMPLATE_FIELDS,
} from '../config/constants';

const QuickMessagePlaceholderFieldSchema = z.enum(QUICK_MESSAGE_TEMPLATE_FIELDS);

function extractPlaceholders(content: string): string[] {
  const matches = content.match(QUICK_MESSAGE_PLACEHOLDER_PATTERN) ?? [];
  return [...new Set(matches.map((match) => match.slice(1)))];
}

function getInvalidPlaceholders(content: string): string[] {
  return extractPlaceholders(content).filter((placeholder) => {
    const result = QuickMessagePlaceholderFieldSchema.safeParse(placeholder);
    return !result.success;
  });
}

const QuickMessageContentSchema = z
  .string()
  .trim()
  .min(1)
  .max(4000)
  .superRefine((value, ctx) => {
    const invalidPlaceholders = getInvalidPlaceholders(value);
    if (invalidPlaceholders.length === 0) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `Unsupported placeholders: ${invalidPlaceholders.map((placeholder) => `#${placeholder}`).join(', ')}`,
    });
  });

export const CreateQuickMessageTemplateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  platform: z.nativeEnum(SocialPlatform),
  content: QuickMessageContentSchema,
});

export const UpdateQuickMessageTemplateSchema = CreateQuickMessageTemplateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: 'At least one field must be provided.',
  },
);

export const QuickMessageTemplateListQuerySchema = z.object({
  platform: z.nativeEnum(SocialPlatform).optional(),
});

export const RenderQuickMessageTemplateSchema = z.object({
  templateId: z.string().trim().min(1),
  customerId: z.string().trim().min(1),
});

export type CreateQuickMessageTemplateDto = z.infer<typeof CreateQuickMessageTemplateSchema>;
export type UpdateQuickMessageTemplateDto = z.infer<typeof UpdateQuickMessageTemplateSchema>;
export type QuickMessageTemplateListQueryDto = z.infer<typeof QuickMessageTemplateListQuerySchema>;
export type RenderQuickMessageTemplateDto = z.infer<typeof RenderQuickMessageTemplateSchema>;
