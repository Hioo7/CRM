import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { ACCESS_TYPE_LABELS, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { OpportunityListItem } from '@/types/opportunity';
import type { Role } from '@/types/auth';

interface OpportunityCardProps {
  opportunity: OpportunityListItem;
  currentEmployeeId: string;
  detailBasePath: string;
  viewerRole?: Role;
}

function getCustomerLabel(opportunity: OpportunityListItem): string {
  const fullName = [
    opportunity.customer.firstName,
    opportunity.customer.lastName,
  ].filter(Boolean).join(' ');

  if (opportunity.customer.company && fullName) {
    return `${fullName} - ${opportunity.customer.company}`;
  }

  if (opportunity.customer.company) {
    return opportunity.customer.company;
  }

  return fullName || 'Unnamed customer';
}

function getAccessTone(opportunity: OpportunityListItem, currentEmployeeId: string, viewerRole?: Role): string {
  if (viewerRole === 'ADMIN' || viewerRole === 'SUPER_ADMIN') {
    return 'border-sky-200 bg-sky-50 text-sky-800';
  }

  if (opportunity.createdById === currentEmployeeId) {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }

  const access = opportunity.accesses.find((entry) => entry.employeeId === currentEmployeeId);
  if (access?.accessType === 'READ_WRITE') {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  return 'border-stone-200 bg-stone-100 text-slate-700';
}

function getAccessLabel(opportunity: OpportunityListItem, currentEmployeeId: string, viewerRole?: Role): string {
  if (viewerRole === 'ADMIN' || viewerRole === 'SUPER_ADMIN') {
    return 'Admin Access';
  }

  if (opportunity.createdById === currentEmployeeId) {
    return 'Owner';
  }

  const access = opportunity.accesses.find((entry) => entry.employeeId === currentEmployeeId);
  return access ? ACCESS_TYPE_LABELS[access.accessType] : ACCESS_TYPE_LABELS.READ_ONLY;
}

function getStageTone(stage: OpportunityListItem['stage']): string {
  switch (stage) {
    case 'CLOSED_WON':
    case 'ACTIVE_RETENTION':
      return 'border-emerald-300 bg-emerald-100 text-emerald-900 shadow-[0_0_0_4px_rgba(16,185,129,0.14),0_10px_24px_rgba(5,150,105,0.18)]';
    case 'NEGOTIATION':
    case 'PROPOSAL_DEMO':
    case 'ONBOARDING':
      return 'border-amber-300 bg-amber-100 text-amber-900 shadow-[0_0_0_4px_rgba(251,191,36,0.16),0_10px_24px_rgba(217,119,6,0.14)]';
    case 'CHURNED_CLOSED_LOST':
      return 'border-rose-300 bg-rose-100 text-rose-900 shadow-[0_0_0_4px_rgba(251,113,133,0.14),0_10px_24px_rgba(225,29,72,0.12)]';
    default:
      return 'border-sky-300 bg-sky-100 text-sky-900 shadow-[0_0_0_4px_rgba(56,189,248,0.14),0_10px_24px_rgba(2,132,199,0.12)]';
  }
}

export function OpportunityCard({ opportunity, currentEmployeeId, detailBasePath, viewerRole }: OpportunityCardProps) {
  const navigate = useNavigate();

  const handleOpen = (): void => {
    navigate(`${detailBasePath}/${opportunity.id}`);
  };

  const customerLabel = getCustomerLabel(opportunity);
  const accessLabel = getAccessLabel(opportunity, currentEmployeeId, viewerRole);

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="dashboard-card flex w-full flex-col gap-3 px-4 py-4 text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400 md:gap-4 md:px-5 md:py-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-900 md:text-lg">{opportunity.name}</p>
          <p className="mt-1 text-sm text-slate-500">{customerLabel}</p>
          <p className="mt-1 text-xs text-slate-400">
            Created by {opportunity.createdBy.username}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] md:px-3 md:text-[0.68rem] ${getAccessTone(opportunity, currentEmployeeId, viewerRole)}`}
        >
          {accessLabel}
        </span>
      </div>

      <div className="rounded-[1.25rem] border border-stone-200/80 bg-stone-50/75 px-3 py-3 md:rounded-[1.5rem] md:px-4 md:py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Current Stage
          </p>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStageTone(opportunity.stage)}`}
          >
            {OPPORTUNITY_STAGE_LABELS[opportunity.stage]}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-400">
          Updated {new Date(opportunity.updatedAt).toLocaleString()}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          Open
          <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
        </span>
      </div>
    </button>
  );
}
