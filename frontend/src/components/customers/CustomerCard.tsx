import { useNavigate } from 'react-router-dom';
import { HiOutlinePhone, HiOutlineChevronRight } from 'react-icons/hi2';
import { ACCESS_TYPE_LABELS } from '@/config/constants';
import type { CustomerListItem } from '@/types/customer';

interface CustomerCardProps {
  customer: CustomerListItem;
  currentEmployeeId: string;
}

function getInitials(firstName: string | null, lastName: string | null): string {
  const f = firstName?.trim()[0] ?? '';
  const l = lastName?.trim()[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

function getAccessLabel(customer: CustomerListItem, currentEmployeeId: string): string {
  if (customer.createdById === currentEmployeeId) return 'Owner';
  const access = (customer.customerAccesses ?? []).find((a) => a.employeeId === currentEmployeeId);
  return access ? ACCESS_TYPE_LABELS[access.accessType] : 'Read Only';
}

function getAccessBadgeClass(label: string): string {
  if (label === 'Owner') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (label === ACCESS_TYPE_LABELS.READ_WRITE) return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-stone-200 bg-stone-100 text-slate-700';
}

function getSourcedByText(customer: CustomerListItem, currentEmployeeId: string): string {
  if (customer.createdById === currentEmployeeId) return 'Sourced by you';
  return `Sourced by ${customer.createdBy?.username ?? 'unknown'}`;
}

export function CustomerCard({ customer, currentEmployeeId }: CustomerCardProps) {
  const navigate = useNavigate();
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Unnamed';
  const initials = getInitials(customer.firstName, customer.lastName);
  const accessLabel = getAccessLabel(customer, currentEmployeeId);
  const badgeClass = getAccessBadgeClass(accessLabel);
  const sourcedBy = getSourcedByText(customer, currentEmployeeId);
  const hasPhone = Boolean(customer.phone);

  const handleCall = (): void => {
    window.location.href = `tel:${customer.phone}`;
  };

  const handleDetails = (): void => {
    navigate(`/employee/dashboard/leads/${customer.id}`);
  };

  return (
    <div className="dashboard-card flex flex-col gap-4 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm font-semibold uppercase text-slate-700">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{fullName}</p>
            {customer.company ? (
              <p className="mt-0.5 text-sm text-slate-500">{customer.company}</p>
            ) : null}
            <p className="mt-0.5 text-xs text-slate-400">{sourcedBy}</p>
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${badgeClass}`}
        >
          {accessLabel}
        </span>
      </div>

      <div className="flex gap-2">
        <div className="tooltip flex-1" data-tip={hasPhone ? `Call ${customer.phone}` : 'No phone number'}>
          <button
            className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400"
            onClick={handleCall}
            disabled={!hasPhone}
            aria-label={`Call ${fullName}`}
          >
            <HiOutlinePhone className="h-4 w-4" />
            Call
          </button>
        </div>
        <button
          className="btn flex-1 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_6px_16px_rgba(5,150,105,0.22)] hover:bg-emerald-700"
          onClick={handleDetails}
          aria-label={`View details for ${fullName}`}
        >
          Details
          <HiOutlineChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
