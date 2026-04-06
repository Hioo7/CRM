import { Role } from '@prisma/client';

export const ROLE_HIERARCHY: Record<Role, number> = {
  EMPLOYEE: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export const BEARER_PREFIX = 'Bearer ';
