import { HiOutlineChartBarSquare, HiOutlinePencilSquare } from 'react-icons/hi2';
import { ROLE_LABELS } from '@/config/constants';
import type { Employee } from '@/types/auth';

interface TeamMemberStats {
  customerCount: number;
  opportunityCount: number;
  activeOpportunityCount: number;
}

interface TeamMemberCardProps {
  employee: Employee;
  stats: TeamMemberStats;
  onViewActivity: (employeeId: string) => void;
  onEdit: (employee: Employee) => void;
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function getRoleBadgeClass(role: string): string {
  if (role === 'ADMIN') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  return 'border-stone-200 bg-stone-100 text-slate-700';
}

export function TeamMemberCard({ employee, stats, onViewActivity, onEdit }: TeamMemberCardProps) {
  const initials = getInitials(employee.username);
  const roleLabel = ROLE_LABELS[employee.role] ?? employee.role;
  const roleBadgeClass = getRoleBadgeClass(employee.role);

  return (
    <div className="dashboard-card flex flex-col gap-4 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm font-semibold text-slate-700">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-900">{employee.username}</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">{employee.email}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wide ${roleBadgeClass}`}
        >
          {roleLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-stone-100 rounded-2xl border border-stone-200 bg-stone-50/60 px-1 py-3">
        <div className="flex flex-col items-center gap-0.5 px-2">
          <span className="text-lg font-semibold tabular-nums text-slate-900">
            {stats.customerCount}
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-wide text-slate-500">
            Customers
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2">
          <span className="text-lg font-semibold tabular-nums text-slate-900">
            {stats.opportunityCount}
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-wide text-slate-500">
            Opps
          </span>
        </div>
        <div className="flex flex-col items-center gap-0.5 px-2">
          <span className="text-lg font-semibold tabular-nums text-slate-900">
            {stats.activeOpportunityCount}
          </span>
          <span className="text-[0.6rem] font-medium uppercase tracking-wide text-slate-500">
            Active
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="btn flex-1 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_6px_16px_rgba(5,150,105,0.22)] hover:bg-emerald-700"
          onClick={() => onViewActivity(employee.id)}
        >
          <HiOutlineChartBarSquare className="h-4 w-4" />
          Activity
        </button>
        <button
          className="btn rounded-2xl border border-stone-200 bg-white px-3 text-slate-600 shadow-none hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
          onClick={() => onEdit(employee)}
          aria-label={`Edit ${employee.username}`}
        >
          <HiOutlinePencilSquare className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
