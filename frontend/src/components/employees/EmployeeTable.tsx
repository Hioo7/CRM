import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import type { EmployeeDashboardRow } from '@/types/employee';

interface EmployeeTableProps {
  rows: EmployeeDashboardRow[];
  onEdit: (row: EmployeeDashboardRow) => void;
  onDelete: (row: EmployeeDashboardRow) => void;
}

function badgeTone(roleTone: EmployeeDashboardRow['roleTone']): string {
  if (roleTone === 'primary') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  }

  if (roleTone === 'secondary') {
    return 'border-amber-200 bg-amber-50 text-amber-800';
  }

  return 'border-stone-200 bg-stone-100 text-slate-700';
}

export function EmployeeTable({ rows, onEdit, onDelete }: EmployeeTableProps) {
  if (rows.length === 0) {
    return (
      <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
        <p className="dashboard-kicker">Empty</p>
        <h3 className="mt-3 text-xl font-semibold text-slate-900">No employees yet</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
          Add your first employee to start assigning access and managing the team from this workspace.
        </p>
      </section>
    );
  }

  return (
    <section className="dashboard-card overflow-hidden">
      <div className="border-b border-stone-200/80 px-5 py-4 md:px-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Directory</p>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="border-b border-stone-200/80">
              <th className="bg-transparent px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:px-7">Employee</th>
              <th className="bg-transparent px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Role</th>
              <th className="bg-transparent px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
              <th className="bg-transparent px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 md:px-7">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.employee.id} className="border-b border-stone-200/60 last:border-b-0 hover:bg-stone-50/70">
                <td className="px-5 py-5 md:px-7">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-100 text-sm font-semibold uppercase text-slate-700">
                        {row.employee.username.slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{row.employee.username}</p>
                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                          <HiOutlineEnvelope className="h-4 w-4 text-slate-400" />
                          <span>{row.employee.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${badgeTone(row.roleTone)}`}>
                    {row.roleLabel}
                  </span>
                </td>
                <td className="px-5 py-5">
                  {row.lockReason ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                      <HiOutlineLockClosed className="h-4 w-4" />
                      Protected
                    </div>
                  ) : (
                    <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">
                      Active
                    </span>
                  )}
                  {row.lockReason ? (
                    <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">{row.lockReason}</p>
                  ) : null}
                </td>
                <td className="px-5 py-5 md:px-7">
                  <div className="flex items-center justify-end gap-2">
                    <div className="tooltip tooltip-left" data-tip={row.canEdit ? 'Edit employee' : row.lockReason ?? 'Protected'}>
                      <button
                        className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400"
                        onClick={() => onEdit(row)}
                        disabled={!row.canEdit}
                        aria-label={`Edit ${row.employee.username}`}
                      >
                        <HiOutlinePencilSquare className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="tooltip tooltip-left" data-tip={row.canDelete ? 'Delete employee' : row.lockReason ?? 'Protected'}>
                      <button
                        className="btn btn-sm rounded-2xl border border-red-200 bg-red-50 text-red-700 shadow-none hover:bg-red-100 disabled:border-stone-200 disabled:bg-stone-100 disabled:text-slate-400"
                        onClick={() => onDelete(row)}
                        disabled={!row.canDelete}
                        aria-label={`Delete ${row.employee.username}`}
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
