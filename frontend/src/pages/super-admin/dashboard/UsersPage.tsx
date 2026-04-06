import { useEffect, useState } from 'react';
import { HiOutlinePlus } from 'react-icons/hi2';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { useModalState } from '@/hooks/useModalState';
import { ErrorBanner } from '@/components/ErrorBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { CreateEmployeeModal } from '@/components/employees/CreateEmployeeModal';
import { EditEmployeeModal } from '@/components/employees/EditEmployeeModal';
import { DeleteEmployeeModal } from '@/components/employees/DeleteEmployeeModal';
import type { EmployeeDashboardRow } from '@/types/employee';
import { buildEmployeeDashboardRow } from '@/utils/employeePermissions';

export function UsersPage() {
  const { employee: actor } = useAuth();
  const { employees, isLoading, error, fetchAll } = useEmployees();
  const createModal = useModalState();
  const editModal = useModalState();
  const deleteModal = useModalState();
  const [selectedRow, setSelectedRow] = useState<EmployeeDashboardRow | null>(null);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  if (!actor) {
    return <LoadingSpinner />;
  }

  const rows = employees.map((employee) => buildEmployeeDashboardRow({ id: actor.id, role: actor.role }, employee));
  const lockedCount = rows.filter((row) => !row.canDelete).length;

  const handleEdit = (row: EmployeeDashboardRow): void => {
    if (!row.canEdit) {
      return;
    }

    setSelectedRow(row);
    editModal.open();
  };

  const handleDelete = (row: EmployeeDashboardRow): void => {
    setSelectedRow(row);
    deleteModal.open();
  };

  const handleEditClose = (): void => {
    editModal.close();
    setSelectedRow(null);
  };

  const handleDeleteClose = (): void => {
    deleteModal.close();
    setSelectedRow(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="dashboard-kicker">People</p>
            <h2 className="dashboard-section-title mt-3">Employees</h2>
            <p className="dashboard-section-copy mt-3">
              Review access, adjust employee accounts, and keep protected records clearly separated from editable ones.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{employees.length}</span> accounts
              {lockedCount > 0 ? ` | ${lockedCount} protected` : ''}
            </div>
            <button
              className="btn rounded-2xl border-0 bg-emerald-600 px-5 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
              onClick={createModal.open}
            >
              <HiOutlinePlus className="h-5 w-5" />
              New Employee
            </button>
          </div>
        </div>
      </section>

      <ErrorBanner message={error} />

      {isLoading ? <LoadingSpinner /> : (
        <EmployeeTable rows={rows} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <CreateEmployeeModal isOpen={createModal.isOpen} onClose={createModal.close} />
      <EditEmployeeModal
        key={`edit-${selectedRow?.employee.id ?? 'empty'}`}
        isOpen={editModal.isOpen}
        employee={selectedRow?.employee ?? null}
        onClose={handleEditClose}
      />
      <DeleteEmployeeModal isOpen={deleteModal.isOpen} row={selectedRow} onClose={handleDeleteClose} />
    </div>
  );
}
