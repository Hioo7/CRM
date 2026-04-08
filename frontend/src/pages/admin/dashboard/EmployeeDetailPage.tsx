import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi2';
import { useEmployees } from '@/hooks/useEmployees';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import { useAuth } from '@/hooks/useAuth';
import { customerService } from '@/services/customerService';
import { opportunityService } from '@/services/opportunityService';
import { AdminActivityFeed } from '@/components/admin/AdminActivityFeed';
import { CustomerCard } from '@/components/customers/CustomerCard';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ROLE_LABELS } from '@/config/constants';
import type { CustomerListItem } from '@/types/customer';
import type { OpportunityListItem } from '@/types/opportunity';

type Tab = 'activity' | 'customers' | 'opportunities';

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { employee: currentEmployee } = useAuth();
  const { employees } = useEmployees();
  const { employeeActivity, isEmployeeActivityLoading, fetchEmployeeActivity } =
    useAdminMonitoring();

  const [activeTab, setActiveTab] = useState<Tab>('activity');
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityListItem[]>([]);
  const [isCustomersLoading, setIsCustomersLoading] = useState(false);
  const [isOppsLoading, setIsOppsLoading] = useState(false);

  const employee = employees.find((e) => e.id === employeeId);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeActivity(employeeId);
    }
  }, [employeeId, fetchEmployeeActivity]);

  useEffect(() => {
    if (!employeeId || activeTab !== 'customers') return;
    const load = async (): Promise<void> => {
      setIsCustomersLoading(true);
      try {
        const data = await customerService.list(employeeId);
        setCustomers(data);
      } catch {
        // errors are non-blocking on this monitoring tab
      } finally {
        setIsCustomersLoading(false);
      }
    };
    void load();
  }, [employeeId, activeTab]);

  useEffect(() => {
    if (!employeeId || activeTab !== 'opportunities') return;
    const load = async (): Promise<void> => {
      setIsOppsLoading(true);
      try {
        const data = await opportunityService.list(undefined, employeeId);
        setOpportunities(data);
      } catch {
        // errors are non-blocking on this monitoring tab
      } finally {
        setIsOppsLoading(false);
      }
    };
    void load();
  }, [employeeId, activeTab]);

  if (!employee || !currentEmployee) return <LoadingSpinner />;

  const joinedDate = new Date(employee.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const roleLabel = ROLE_LABELS[employee.role] ?? employee.role;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'activity', label: 'Activity' },
    { key: 'customers', label: 'Customers' },
    { key: 'opportunities', label: 'Opportunities' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <button
          type="button"
          className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          onClick={() => navigate('/admin/dashboard/team')}
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to Team
        </button>

        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-lg font-semibold text-slate-700">
            {employee.username.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="dashboard-kicker">{roleLabel}</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{employee.username}</h2>
            <p className="mt-0.5 text-sm text-slate-500">{employee.email}</p>
            <p className="mt-0.5 text-xs text-slate-400">Joined {joinedDate}</p>
          </div>
        </div>

        <div className="mt-5 flex gap-1 rounded-2xl border border-stone-200 bg-stone-50/60 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                'flex-1 rounded-xl py-2 text-sm font-semibold transition-colors',
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
              ].join(' ')}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === 'activity' && (
        <section className="dashboard-card px-5 py-5">
          <p className="dashboard-kicker mb-4">Stage Change History</p>
          {isEmployeeActivityLoading ? (
            <LoadingSpinner />
          ) : (
            <AdminActivityFeed
              entries={employeeActivity}
              showEmployee={false}
              opportunityBasePath="/admin/dashboard/opportunities"
            />
          )}
        </section>
      )}

      {activeTab === 'customers' && (
        <div>
          {isCustomersLoading ? (
            <LoadingSpinner />
          ) : customers.length === 0 ? (
            <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
              <p className="text-sm text-slate-500">This employee has not created any customers.</p>
            </section>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {customers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  currentEmployeeId={currentEmployee.id}
                  detailBasePath="/admin/dashboard/leads"
                  viewerRole={currentEmployee.role}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div>
          {isOppsLoading ? (
            <LoadingSpinner />
          ) : opportunities.length === 0 ? (
            <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
              <p className="text-sm text-slate-500">
                This employee has not created any opportunities.
              </p>
            </section>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  currentEmployeeId={currentEmployee.id}
                  detailBasePath="/admin/dashboard/opportunities"
                  viewerRole={currentEmployee.role}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
