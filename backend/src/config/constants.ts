import { Role } from "@prisma/client";

export const ROLE_HIERARCHY: Record<Role, number> = {
  EMPLOYEE: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

export const BEARER_PREFIX = "Bearer ";

export const QUICK_MESSAGE_TEMPLATE_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "instagramHandle",
  "linkedinProfileUrl",
  "address",
  "city",
  "state",
  "country",
  "zipCode",
  "company",
  "notes",
] as const;

export const QUICK_MESSAGE_PLACEHOLDER_PATTERN = /#[A-Za-z][A-Za-z0-9]*/g;
