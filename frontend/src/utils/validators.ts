import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  MANAGEABLE_ROLES,
  COUNTRIES,
} from '@/config/constants';
import type { CreateEmployeePayload, UpdateEmployeePayload, UpdateSelfPayload } from '@/types/employee';
import type { LoginPayload } from '@/types/auth';
import type { CreateCustomerPayload, UpdateCustomerPayload } from '@/types/customer';
import type {
  CreateOpportunityPayload,
  ChangeOpportunityStagePayload,
  GrantOpportunityAccessPayload,
} from '@/types/opportunity';

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

const PHONE_PATTERN = /^\+[\d\s\-().]{6,19}$/;
const ZIP_PATTERN = /^[A-Za-z0-9\- ]{3,20}$/;
const INSTAGRAM_HANDLE_PATTERN = /^(?!.*\.\.)(?!\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;

type CustomerFieldKey = keyof UpdateCustomerPayload;

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

export function validateCustomerField(field: CustomerFieldKey, value: string): string | null {
  const v = value.trim();

  switch (field) {
    case 'firstName':
    case 'lastName':
      if (!v) return 'This field cannot be empty.';
      if (v.length > 100) return 'Must be 100 characters or fewer.';
      return null;

    case 'company':
      if (!v) return 'This field cannot be empty.';
      if (v.length > 255) return 'Must be 255 characters or fewer.';
      return null;

    case 'email':
      if (!v) return 'Email cannot be empty.';
      if (!isValidEmail(v)) return 'Enter a valid email address.';
      return null;

    case 'phone':
      if (!v) return 'Phone cannot be empty.';
      if (!PHONE_PATTERN.test(v)) return 'Enter a valid phone number starting with + and country code (e.g. +1 415 000 0000).';
      return null;

    case 'instagramHandle':
      if (!v) return 'Instagram handle cannot be empty.';
      if (v.includes('http') || v.includes('/') || v.includes('@')) {
        return 'Instagram handle must be the raw handle only, not a URL or @mention.';
      }
      if (!INSTAGRAM_HANDLE_PATTERN.test(v)) {
        return 'Instagram handle may only contain letters, numbers, periods, and underscores.';
      }
      return null;

    case 'linkedinProfileUrl':
      if (!v) return 'LinkedIn profile URL cannot be empty.';
      if (!isValidLinkedinProfileUrl(v)) {
        return 'Enter a valid linkedin.com profile URL.';
      }
      return null;

    case 'address':
      if (v.length > 255) return 'Must be 255 characters or fewer.';
      return null;

    case 'city':
    case 'state':
      if (v.length > 100) return 'Must be 100 characters or fewer.';
      return null;

    case 'country':
      if (!v) return 'Please select a country.';
      if (!COUNTRIES.includes(v)) return 'Select a valid country from the list.';
      return null;

    case 'zipCode':
      if (!ZIP_PATTERN.test(v)) return 'Enter a valid postal / ZIP code (3–20 alphanumeric characters).';
      return null;

    case 'notes':
      if (v.length > 2000) return 'Notes must be 2000 characters or fewer.';
      return null;

    default:
      return null;
  }
}

export function validateCreateCustomerForm(payload: CreateCustomerPayload): string | null {
  const hasName = (payload.firstName?.trim() ?? '') || (payload.lastName?.trim() ?? '');
  if (!hasName) return 'Please provide at least a first or last name.';

  if (payload.firstName !== undefined) {
    const err = validateCustomerField('firstName', payload.firstName);
    if (err) return err;
  }
  if (payload.lastName !== undefined) {
    const err = validateCustomerField('lastName', payload.lastName);
    if (err) return err;
  }
  if (payload.email !== undefined && payload.email.trim()) {
    const err = validateCustomerField('email', payload.email);
    if (err) return err;
  }
  if (payload.phone !== undefined && payload.phone.trim()) {
    const err = validateCustomerField('phone', payload.phone);
    if (err) return err;
  }
  if (payload.company !== undefined && payload.company.trim()) {
    const err = validateCustomerField('company', payload.company);
    if (err) return err;
  }

  return null;
}

export function validateCreateOpportunityForm(payload: CreateOpportunityPayload): string | null {
  if (!payload.customerId.trim()) return 'Please select a customer.';

  const name = payload.name.trim();
  if (!name) return 'Opportunity name is required.';
  if (name.length > 255) return 'Opportunity name must be 255 characters or fewer.';

  return null;
}

export function validateOpportunityStageChangeForm(
  payload: ChangeOpportunityStagePayload,
): string | null {
  if (!payload.toStage.trim()) return 'Please select a stage.';
  if (payload.notes !== undefined && payload.notes.trim().length > 5000) {
    return 'Notes must be 5000 characters or fewer.';
  }

  return null;
}

export function validateOpportunityAccessForm(
  payload: GrantOpportunityAccessPayload,
): string | null {
  if (!payload.employeeId.trim()) return 'Please select an employee.';
  if (payload.accessType !== 'READ_ONLY' && payload.accessType !== 'READ_WRITE') {
    return 'Please choose a valid access level.';
  }

  return null;
}
