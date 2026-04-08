import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useCustomers } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { CustomerProfileSection } from '@/components/customers/CustomerProfileSection';
import { CustomerAccessSection } from '@/components/customers/CustomerAccessSection';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ACCESS_TYPE_LABELS } from '@/config/constants';
import type { UpdateCustomerPayload, GrantAccessPayload } from '@/types/customer';

type Tab = 'profile' | 'access';

const TABS: { key: Tab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'access', label: 'Access' },
];

export function CustomerDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const { selectedCustomer, isDetailLoading, fetchCustomer, updateCustomer, grantAccess, revokeAccess } = useCustomers();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  useEffect(() => {
    if (customerId) {
      fetchCustomer(customerId);
    }
  }, [customerId, fetchCustomer]);

  if (!employee) return null;

  if (isDetailLoading || !selectedCustomer) {
    return <LoadingSpinner />;
  }

  const customer = selectedCustomer;
  const accesses = customer.customerAccesses ?? [];
  const isAdminUser = employee.role === 'ADMIN' || employee.role === 'SUPER_ADMIN';
  const leadsBasePath = isAdminUser ? '/admin/dashboard/leads' : '/employee/dashboard/leads';
  const isOwner = customer.createdById === employee.id;
  const myAccess = accesses.find((a) => a.employeeId === employee.id);
  const canWrite = isAdminUser || isOwner || myAccess?.accessType === 'READ_WRITE';

  const accessLabel = isAdminUser
    ? 'Admin'
    : isOwner
    ? 'Owner'
    : myAccess
    ? ACCESS_TYPE_LABELS[myAccess.accessType]
    : 'View Only';

  const accessBadgeClass = isAdminUser || isOwner
    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
    : canWrite
    ? 'border-amber-200 bg-amber-50 text-amber-800'
    : 'border-stone-200 bg-stone-100 text-slate-700';

  const fullName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Unnamed';

  const handleUpdate = async (payload: UpdateCustomerPayload): Promise<void> => {
    await updateCustomer(customer.id, payload);
  };

  const handleGrant = async (payload: GrantAccessPayload): Promise<void> => {
    await grantAccess(customer.id, payload);
  };

  const handleRevoke = async (employeeId: string): Promise<void> => {
    await revokeAccess(customer.id, employeeId);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <section className="dashboard-panel px-5 py-5 md:px-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <button
              className="btn btn-sm mt-0.5 rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50"
              onClick={() => navigate(leadsBasePath)}
              aria-label="Back to leads"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="dashboard-kicker">Customer</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{fullName}</h2>
              {customer.company ? (
                <p className="mt-0.5 text-sm text-slate-500">{customer.company}</p>
              ) : null}
            </div>
          </div>
          <span
            className={`mt-1 inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${accessBadgeClass}`}
          >
            {accessLabel}
          </span>
        </div>
      </section>

      {/* Sticky pill tabs */}
      <div className="sticky top-[4.5rem] z-10 -mx-4 bg-gradient-to-b from-stone-50 px-4 pb-2 pt-1 md:-mx-6 md:px-6">
        <div className="flex justify-center gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={[
                'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                activeTab === tab.key
                  ? 'border-emerald-300 bg-emerald-600 text-white shadow-[0_4px_12px_rgba(5,150,105,0.22)]'
                  : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50',
              ].join(' ')}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === 'profile' ? (
        <CustomerProfileSection
          customer={customer}
          canWrite={canWrite}
          onUpdate={handleUpdate}
        />
      ) : null}

      {activeTab === 'access' ? (
        <CustomerAccessSection
          customer={customer}
          currentEmployeeId={employee.id}
          canWrite={canWrite}
          onGrant={handleGrant}
          onRevoke={handleRevoke}
        />
      ) : null}
    </div>
  );
}
