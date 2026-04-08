import { useState } from 'react';
import { HiOutlineChevronDown, HiOutlineChevronRight } from 'react-icons/hi2';
import { OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { ActivityEntry } from '@/types/admin';
import type { OpportunityStage } from '@/types/opportunity';

interface AdminActivityFeedItemProps {
  entry: ActivityEntry;
  showEmployee: boolean;
  onOpportunityClick: (opportunityId: string) => void;
}

function getStageBadgeClass(stage: OpportunityStage): string {
  switch (stage) {
    case 'CLOSED_WON':
    case 'ACTIVE_RETENTION':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'NEGOTIATION':
    case 'PROPOSAL_DEMO':
    case 'ONBOARDING':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'CHURNED_CLOSED_LOST':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    default:
      return 'border-sky-200 bg-sky-50 text-sky-800';
  }
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getCustomerLabel(customer: ActivityEntry['customer']): string {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  if (customer.company && name) return `${name} · ${customer.company}`;
  return customer.company ?? name ?? 'Unknown customer';
}

export function AdminActivityFeedItem({
  entry,
  showEmployee,
  onOpportunityClick,
}: AdminActivityFeedItemProps) {
  const [notesExpanded, setNotesExpanded] = useState(false);
  const hasNotes = Boolean(entry.notes);
  const hasEdits = entry.noteEdits.length > 0;

  return (
    <div className="flex gap-3">
      {showEmployee && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-xs font-semibold text-slate-600">
          {getInitials(entry.changedBy.username)}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {showEmployee && (
            <span className="text-sm font-semibold text-slate-900">{entry.changedBy.username}</span>
          )}
          <button
            type="button"
            className="min-w-0 truncate text-sm font-medium text-emerald-700 hover:underline"
            onClick={() => onOpportunityClick(entry.opportunityId)}
          >
            {entry.opportunityName}
          </button>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs text-slate-500">{getCustomerLabel(entry.customer)}</span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {entry.fromStage && (
            <>
              <span
                className={`inline-flex rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${getStageBadgeClass(entry.fromStage)}`}
              >
                {OPPORTUNITY_STAGE_LABELS[entry.fromStage]}
              </span>
              <HiOutlineChevronRight className="h-3 w-3 text-slate-400" />
            </>
          )}
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide ${getStageBadgeClass(entry.toStage)}`}
          >
            {OPPORTUNITY_STAGE_LABELS[entry.toStage]}
          </span>
          <span className="ml-1 text-xs text-slate-400">{formatTimeAgo(entry.changedAt)}</span>
        </div>

        {(hasNotes || hasEdits) && (
          <button
            type="button"
            className="mt-1.5 flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
            onClick={() => setNotesExpanded((prev) => !prev)}
          >
            <HiOutlineChevronDown
              className={`h-3.5 w-3.5 transition-transform ${notesExpanded ? 'rotate-180' : ''}`}
            />
            {notesExpanded ? 'Hide notes' : 'Show notes'}
          </button>
        )}

        {notesExpanded && (
          <div className="mt-2 space-y-1.5">
            {hasNotes && (
              <p className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs leading-5 text-slate-700">
                {entry.notes}
              </p>
            )}
            {entry.noteEdits.map((edit) => (
              <div key={edit.id} className="ml-3 border-l-2 border-amber-200 pl-3">
                <p className="text-[0.65rem] font-medium text-amber-700">
                  Edited by {edit.editedBy.username} · {formatTimeAgo(edit.editedAt)}
                </p>
                <p className="mt-0.5 text-xs leading-5 text-slate-700">{edit.newNotes}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
