import { z } from 'zod';

function isValidLinkedinProfileUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const isLinkedinHost = hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com');
    return isLinkedinHost && url.pathname.trim() !== '' && url.pathname !== '/';
  } catch {
    return false;
  }
}

const InstagramHandleSchema = z
  .string()
  .trim()
  .min(1)
  .max(30)
  .regex(/^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._]+$/, {
    message: 'Instagram handle must contain only letters, numbers, periods, and underscores.',
  })
  .refine((value) => !value.includes('http') && !value.includes('/') && !value.includes('@'), {
    message: 'Instagram handle must be the profile handle only, not a URL or @mention.',
  });

const LinkedinProfileUrlSchema = z
  .string()
  .trim()
  .url()
  .refine(isValidLinkedinProfileUrl, {
    message: 'LinkedIn profile URL must be a valid linkedin.com URL.',
  });

const customerFields = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  instagramHandle: InstagramHandleSchema.optional(),
  linkedinProfileUrl: LinkedinProfileUrlSchema.optional(),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  company: z.string().min(1).max(255).optional(),
  notes: z.string().max(2000).optional(),
});

export const CreateCustomerSchema = customerFields;
export const UpdateCustomerSchema = customerFields.partial();

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
