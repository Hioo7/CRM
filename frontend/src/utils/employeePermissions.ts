import { ROLE_HIERARCHY, ROLE_LABELS } from '@/config/constants';
import type { Employee } from '@/types/auth';
import type { EmployeeActor, EmployeeDashboardRow } from '@/types/employee';

function canManage(actorRole: EmployeeActor['role'], targetRole: Employee['role']): boolean {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
}

function getLockReason(actor: EmployeeActor, employee: Employee): string | null {
  if (actor.id === employee.id) {
    return 'Your own account is protected. Manage it from the profile screen instead.';
  }

  if (!canManage(actor.role, employee.role)) {
    return 'This account is protected by role hierarchy and cannot be changed here.';
  }

  return null;
}

function getRoleTone(role: Employee['role']): EmployeeDashboardRow['roleTone'] {
  if (role === 'SUPER_ADMIN') {
    return 'primary';
  }

  if (role === 'ADMIN') {
    return 'secondary';
  }

  return 'neutral';
}

export function buildEmployeeDashboardRow(actor: EmployeeActor, employee: Employee): EmployeeDashboardRow {
  const lockReason = getLockReason(actor, employee);
  const canEdit = lockReason === null;
  const canDelete = lockReason === null;

  return {
    employee,
    canEdit,
    canDelete,
    lockReason,
    roleLabel: ROLE_LABELS[employee.role] ?? employee.role,
    roleTone: getRoleTone(employee.role),
  };
}
