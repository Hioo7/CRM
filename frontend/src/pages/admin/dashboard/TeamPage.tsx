import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import { useEmployees } from '@/hooks/useEmployees';
import { useCustomers } from '@/hooks/useCustomers';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useModalState } from '@/hooks/useModalState';
import { TeamMemberCard } from '@/components/admin/TeamMemberCard';
import { EditEmployeeModal } from '@/components/employees/EditEmployeeModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBanner } from '@/components/ErrorBanner';
import type { Employee } from '@/types/auth';

const OPEN_STAGES = new Set([
  'LEAD',
  'QUALIFIED_LEAD',
  'NEEDS_ANALYSIS',
  'PROPOSAL_DEMO',
  'NEGOTIATION',
  'ONBOARDING',
  'ACTIVE_RETENTION',
]);

export function TeamPage() {
  const { employees, isLoading, error, fetchAll } = useEmployees();
  const { customers } = useCustomers();
  const { opportunities } = useOpportunities();
  const navigate = useNavigate();
  const editModal = useModalState();
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return employees;
    return employees.filter(
      (e) =>
        e.username.toLowerCase().includes(query) || e.email.toLowerCase().includes(query),
    );
  }, [employees, search]);

  const handleViewActivity = (employeeId: string): void => {
    navigate(`/admin/dashboard/team/${employeeId}`);
  };

  const handleEdit = (employee: Employee): void => {
    setSelectedEmployee(employee);
    editModal.open();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="dashboard-kicker">Team</p>
            <h2 className="dashboard-section-title mt-3">Your team</h2>
            <p className="dashboard-section-copy mt-2">
              {employees.length} member{employees.length === 1 ? '' : 's'} · Click Activity to monitor
              individual performance.
            </p>
          </div>
        </div>

        <label className="form-control mt-4">
          <div className="relative">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              className="input h-11 w-full rounded-2xl border-stone-200 bg-stone-50/70 pl-11 text-slate-900"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </label>
      </section>

      <ErrorBanner message={error} />

      {filtered.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="text-sm text-slate-500">No team members match your search.</p>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((employee) => {
            const customerCount = customers.filter((c) => c.createdById === employee.id).length;
            const employeeOpps = opportunities.filter((o) => o.createdById === employee.id);
            const opportunityCount = employeeOpps.length;
            const activeOpportunityCount = employeeOpps.filter((o) =>
              OPEN_STAGES.has(o.stage),
            ).length;

            return (
              <TeamMemberCard
                key={employee.id}
                employee={employee}
                stats={{ customerCount, opportunityCount, activeOpportunityCount }}
                onViewActivity={handleViewActivity}
                onEdit={handleEdit}
              />
            );
          })}
        </div>
      )}

      <EditEmployeeModal
        isOpen={editModal.isOpen}
        employee={selectedEmployee}
        onClose={editModal.close}
      />
    </div>
  );
}
