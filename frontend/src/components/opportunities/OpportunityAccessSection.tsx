import { useState } from 'react';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineUserPlus } from 'react-icons/hi2';
import { OpportunityAccessModal } from './OpportunityAccessModal';
import { ACCESS_TYPE_LABELS } from '@/config/constants';
import type { Employee } from '@/types/auth';
import type { OpportunityDetail, GrantOpportunityAccessPayload } from '@/types/opportunity';

interface OpportunityAccessSectionProps {
  opportunity: OpportunityDetail;
  employees: Employee[];
  currentEmployeeId: string;
  canWrite: boolean;
  onGrant: (payload: GrantOpportunityAccessPayload) => Promise<void>;
  onRevoke: (employeeId: string) => Promise<void>;
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export function OpportunityAccessSection({
  opportunity,
  employees,
  currentEmployeeId,
  canWrite,
  onGrant,
  onRevoke,
}: OpportunityAccessSectionProps) {
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleRevoke = async (employeeId: string): Promise<void> => {
    setRevokingId(employeeId);
    try {
      await onRevoke(employeeId);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <>
      <section className="dashboard-panel px-5 py-6 md:px-7">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <p className="dashboard-kicker">Access</p>
            <h3 className="dashboard-section-title mt-3">Share this opportunity</h3>
            <p className="dashboard-section-copy mt-3">
              Grant access to other employees only. Admin and super admin users are not controlled by this list.
            </p>
          </div>
          {canWrite ? (
            <button
              className="btn rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setIsGrantModalOpen(true)}
            >
              <HiOutlineUserPlus className="h-5 w-5" />
              Grant Access
            </button>
          ) : null}
        </div>
      </section>

      <section className="dashboard-panel overflow-hidden">
        {(opportunity.accesses ?? []).length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-500">No employee access entries yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {opportunity.accesses.map((entry) => {
              const isMe = entry.employeeId === currentEmployeeId;
              const isCreator = entry.employeeId === opportunity.createdById;
              const canEdit = canWrite && !isMe;
              const canRevoke = canWrite && !isMe && !isCreator;

              return (
                <div key={entry.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm font-semibold uppercase text-slate-700">
                    {getInitials(entry.employee.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {isMe ? 'You' : entry.employee.username}
                      {isCreator ? (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Creator
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{entry.employee.email}</p>
                  </div>
                  <span className="inline-flex shrink-0 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                    {ACCESS_TYPE_LABELS[entry.accessType]}
                  </span>
                  {canEdit ? (
                    <button
                      className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-500 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => setIsGrantModalOpen(true)}
                      aria-label={`Edit access for ${entry.employee.username}`}
                    >
                      <HiOutlinePencilSquare className="h-4 w-4" />
                    </button>
                  ) : null}
                  {canRevoke ? (
                    <button
                      className="btn btn-sm rounded-2xl border border-red-200 bg-red-50 text-red-700 shadow-none hover:bg-red-100 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400"
                      onClick={() => handleRevoke(entry.employeeId)}
                      disabled={revokingId === entry.employeeId}
                      aria-label={`Revoke access for ${entry.employee.username}`}
                    >
                      {revokingId === entry.employeeId ? (
                        <span className="loading loading-spinner loading-xs" />
                      ) : (
                        <HiOutlineTrash className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <OpportunityAccessModal
        isOpen={isGrantModalOpen}
        employees={employees}
        existingAccesses={opportunity.accesses}
        currentEmployeeId={currentEmployeeId}
        onClose={() => setIsGrantModalOpen(false)}
        onSubmit={onGrant}
      />
    </>
  );
}
