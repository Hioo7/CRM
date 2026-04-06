/** Duration (ms) for which form error banners remain visible before auto-dismissal. */
export const ERROR_DISPLAY_DURATION_MS = 5000;

/** localStorage key for the auth JWT. */
export const AUTH_TOKEN_KEY = 'crm_auth_token';

/** Base URL for all API requests. */
export const API_BASE_URL = 'http://localhost:3000/api';

/** Roles a super admin or admin can assign when creating/editing an employee. */
export const MANAGEABLE_ROLES: Array<'ADMIN' | 'EMPLOYEE'> = ['ADMIN', 'EMPLOYEE'];

/** Human-readable labels for each role. */
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  EMPLOYEE: 'Employee',
};

export const ROLE_HIERARCHY = {
  EMPLOYEE: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
} as const;

export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;

export const DASHBOARD_NAV_ITEMS = [
  { label: 'Users', to: '/super-admin/dashboard/users' },
  { label: 'Profile', to: '/super-admin/dashboard/profile' },
] as const;
