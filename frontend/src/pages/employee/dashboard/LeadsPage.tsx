import { useNavigate } from 'react-router-dom';
import { HiOutlineUserPlus } from 'react-icons/hi2';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { useModalState } from '@/hooks/useModalState';
import { extractApiErrorMessage } from '@/utils/errors';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import type { CreateCustomerPayload } from '@/types/customer';

export function LeadsPage() {
  const { employee } = useAuth();
  const { customers, isLoading, createCustomer } = useCustomers();
  const createModal = useModalState();
  const navigate = useNavigate();
  const banner = useErrorBanner();

  if (!employee) return null;

  const owned = customers.filter((c) => c.createdById === employee.id);
  const shared = customers.filter((c) => c.createdById !== employee.id);

  const handleCreate = async (payload: CreateCustomerPayload): Promise<void> => {
    const created = await createCustomer(payload);
    navigate(`/employee/dashboard/leads/${created.id}`);
  };

  const handleCreateError = (err: Error): void => {
    banner.showError(extractApiErrorMessage(err));
  };

  const wrappedCreate = async (payload: CreateCustomerPayload): Promise<void> => {
    try {
      await handleCreate(payload);
    } catch (err) {
      handleCreateError(err as Error);
      throw err;
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="dashboard-kicker">Leads</p>
            <h2 className="dashboard-section-title mt-3">My Customers</h2>
            {customers.length > 0 ? (
              <p className="dashboard-section-copy mt-2">
                {owned.length} owned · {shared.length} shared
              </p>
            ) : null}
          </div>
          <button
            className="btn shrink-0 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
            onClick={createModal.open}
          >
            <HiOutlineUserPlus className="h-5 w-5" />
            <span className="hidden sm:inline">New Customer</span>
          </button>
        </div>
      </section>

      <ErrorBanner message={banner.error} />

      {customers.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="dashboard-kicker">Empty</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">No customers yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Add your first customer to start managing your leads from this workspace.
          </p>
          <button
            className="btn mt-6 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
            onClick={createModal.open}
          >
            <HiOutlineUserPlus className="h-5 w-5" />
            New Customer
          </button>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              currentEmployeeId={employee.id}
            />
          ))}
        </div>
      )}

      <CreateCustomerModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSubmit={wrappedCreate}
      />
    </div>
  );
}
