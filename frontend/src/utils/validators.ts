import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  MANAGEABLE_ROLES,
} from '@/config/constants';
import type { CreateEmployeePayload, UpdateEmployeePayload, UpdateSelfPayload } from '@/types/employee';
import type { LoginPayload } from '@/types/auth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function validateLoginForm(payload: LoginPayload): string | null {
  if (!payload.email.trim()) return 'Email is required.';
  if (!isValidEmail(payload.email)) return 'Enter a valid email address.';
  if (!payload.password.trim()) return 'Password is required.';
  return null;
}

export function validateCreateEmployeeForm(payload: CreateEmployeePayload): string | null {
  const username = payload.username.trim();
  if (!username) return 'Username is required.';
  if (username.length < USERNAME_MIN_LENGTH) return `Username must be at least ${USERNAME_MIN_LENGTH} characters.`;
  if (username.length > USERNAME_MAX_LENGTH) return `Username must be at most ${USERNAME_MAX_LENGTH} characters.`;

  if (!payload.email.trim()) return 'Email is required.';
  if (!isValidEmail(payload.email)) return 'Enter a valid email address.';

  if (!payload.password.trim()) return 'Password is required.';
  if (payload.password.trim().length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;

  if (!(MANAGEABLE_ROLES as string[]).includes(payload.role)) return 'Invalid role selected.';

  return null;
}

export function validateUpdateEmployeeForm(payload: UpdateEmployeePayload): string | null {
  const hasField = payload.email !== undefined || payload.password !== undefined || payload.role !== undefined;
  if (!hasField) return 'At least one field must be provided.';

  if (payload.email !== undefined) {
    if (!payload.email.trim()) return 'Email cannot be empty.';
    if (!isValidEmail(payload.email)) return 'Enter a valid email address.';
  }

  if (payload.password !== undefined) {
    if (payload.password.trim().length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (payload.role !== undefined && !(MANAGEABLE_ROLES as string[]).includes(payload.role)) {
    return 'Invalid role selected.';
  }

  return null;
}

export function validateUpdateSelfForm(payload: UpdateSelfPayload): string | null {
  const hasField = payload.email !== undefined || payload.password !== undefined;
  if (!hasField) return 'At least one field must be provided.';

  if (payload.email !== undefined) {
    if (!payload.email.trim()) return 'Email cannot be empty.';
    if (!isValidEmail(payload.email)) return 'Enter a valid email address.';
  }

  if (payload.password !== undefined) {
    if (payload.password.trim().length < PASSWORD_MIN_LENGTH) return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (password !== confirmPassword) return 'Passwords do not match.';
  return null;
}
