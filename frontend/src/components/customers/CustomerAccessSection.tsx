import { useState } from 'react';
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineUserPlus } from 'react-icons/hi2';
import { GrantAccessModal } from './GrantAccessModal';
import { ACCESS_TYPE_LABELS } from '@/config/constants';
import type { CustomerDetail, GrantAccessPayload, AccessType } from '@/types/customer';

interface CustomerAccessSectionProps {
  customer: CustomerDetail;
  currentEmployeeId: string;
  canWrite: boolean;
  onGrant: (payload: GrantAccessPayload) => Promise<void>;
  onRevoke: (employeeId: string) => Promise<void>;
}

function getInitials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

function getAccessBadgeClass(accessType: AccessType): string {
  return accessType === 'READ_WRITE'
    ? 'border-amber-200 bg-amber-50 text-amber-800'
    : 'border-stone-200 bg-stone-100 text-slate-700';
}

export function CustomerAccessSection({
  customer,
  currentEmployeeId,
  canWrite,
  onGrant,
  onRevoke,
}: CustomerAccessSectionProps) {
  const [grantModalOpen, setGrantModalOpen] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  const handleRevoke = async (employeeId: string): Promise<void> => {
    setRevoking(employeeId);
    try {
      await onRevoke(employeeId);
    } finally {
      setRevoking(null);
    }
  };

  return (
    <>
      <section className="dashboard-panel overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-stone-200/80 px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Who Has Access
          </p>
          {canWrite ? (
            <button
              className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              onClick={() => setGrantModalOpen(true)}
            >
              <HiOutlineUserPlus className="h-4 w-4" />
              Grant Access
            </button>
          ) : null}
        </div>

        {(customer.customerAccesses ?? []).length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-500">No access entries found.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {(customer.customerAccesses ?? []).map((entry) => {
              const isMe = entry.employeeId === currentEmployeeId;
              const isOwner = entry.employeeId === customer.createdById;
              const canRevoke = canWrite && !isMe && !isOwner;
              const canEdit = canWrite && !isMe;

              return (
                <div key={entry.id} className="flex items-center gap-3 px-5 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-sm font-semibold uppercase text-slate-700">
                    {getInitials(entry.employee.username)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {isMe ? 'You' : entry.employee.username}
                      {isOwner ? (
                        <span className="ml-2 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                          Owner
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{entry.employee.email}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${getAccessBadgeClass(entry.accessType)}`}
                  >
                    {ACCESS_TYPE_LABELS[entry.accessType]}
                  </span>
                  {canEdit ? (
                    <button
                      className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-500 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => setGrantModalOpen(true)}
                      aria-label={`Edit access for ${entry.employee.username}`}
                      title="Edit access"
                    >
                      <HiOutlinePencilSquare className="h-4 w-4" />
                    </button>
                  ) : null}
                  {canRevoke ? (
                    <button
                      className="btn btn-sm rounded-2xl border border-red-200 bg-red-50 text-red-700 shadow-none hover:bg-red-100 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400"
                      onClick={() => handleRevoke(entry.employeeId)}
                      disabled={revoking === entry.employeeId}
                      aria-label={`Revoke access for ${entry.employee.username}`}
                      title="Revoke access"
                    >
                      {revoking === entry.employeeId ? (
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

      <GrantAccessModal
        isOpen={grantModalOpen}
        customerId={customer.id}
        existingAccess={customer.customerAccesses ?? []}
        currentEmployeeId={currentEmployeeId}
        onClose={() => setGrantModalOpen(false)}
        onSubmit={onGrant}
      />
    </>
  );
}
