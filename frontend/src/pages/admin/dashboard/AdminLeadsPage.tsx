import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useCustomers } from '@/hooks/useCustomers';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
import { useModalState } from '@/hooks/useModalState';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBanner } from '@/components/ErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import type { CreateCustomerPayload } from '@/types/customer';

export function AdminLeadsPage() {
  const { employee } = useAuth();
  const { customers, isLoading, createCustomer } = useCustomers();
  const { employees } = useEmployees();
  const createModal = useModalState();
  const navigate = useNavigate();
  const banner = useErrorBanner();
  const [createdByFilter, setCreatedByFilter] = useState<string>('ALL');

  const filtered = useMemo(() => {
    if (createdByFilter === 'ALL') return customers;
    return customers.filter((c) => c.createdById === createdByFilter);
  }, [customers, createdByFilter]);

  if (!employee) return null;
  if (isLoading) return <LoadingSpinner />;

  const handleCreate = async (payload: CreateCustomerPayload): Promise<void> => {
    try {
      const created = await createCustomer(payload);
      navigate(`/admin/dashboard/leads/${created.id}`);
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
      throw err;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="dashboard-kicker">Leads</p>
            <h2 className="dashboard-section-title mt-3">All Customers</h2>
            <p className="dashboard-section-copy mt-2">
              {filtered.length} customer{filtered.length === 1 ? '' : 's'}
              {createdByFilter !== 'ALL' ? ' for selected employee' : ' across your team'}
            </p>
          </div>
          <button
            className="btn shrink-0 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
            onClick={createModal.open}
          >
            <HiOutlineUserPlus className="h-5 w-5" />
            <span className="hidden sm:inline">New Customer</span>
          </button>
        </div>

        <label className="form-control mt-4">
          <span className="mb-1.5 text-sm font-semibold text-slate-700">Created by</span>
          <select
            className="select h-11 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
            value={createdByFilter}
            onChange={(e) => setCreatedByFilter(e.target.value)}
          >
            <option value="ALL">All employees</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.username}
              </option>
            ))}
          </select>
        </label>
      </section>

      <ErrorBanner message={banner.error} />

      {filtered.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="dashboard-kicker">Empty</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">No customers found</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {createdByFilter !== 'ALL'
              ? 'No customers have been created by this employee yet.'
              : 'Add your first customer to start managing leads across your team.'}
          </p>
          {createdByFilter === 'ALL' && (
            <button
              className="btn mt-6 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
              onClick={createModal.open}
            >
              <HiOutlineUserPlus className="h-5 w-5" />
              New Customer
            </button>
          )}
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              currentEmployeeId={employee.id}
              detailBasePath="/admin/dashboard/leads"
              viewerRole={employee.role}
            />
          ))}
        </div>
      )}

      <CreateCustomerModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSubmit={handleCreate}
      />
    </div>
  );
}
