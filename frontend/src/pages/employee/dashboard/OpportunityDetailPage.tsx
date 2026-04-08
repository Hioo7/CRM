import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiOutlineArrowLeft, HiOutlineBell } from 'react-icons/hi2';
import { OpportunityStageTracker } from '@/components/opportunities/OpportunityStageTracker';
import { OpportunityActivityFeed } from '@/components/opportunities/OpportunityActivityFeed';
import { OpportunityStageChangeModal } from '@/components/opportunities/OpportunityStageChangeModal';
import { OpportunityAccessSection } from '@/components/opportunities/OpportunityAccessSection';
import { CreateReminderModal } from '@/components/reminders/CreateReminderModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ACCESS_TYPE_LABELS, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import { useAuth } from '@/hooks/useAuth';
import { useModalState } from '@/hooks/useModalState';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useReminders } from '@/hooks/useReminders';
import type { ChangeOpportunityStagePayload, GrantOpportunityAccessPayload } from '@/types/opportunity';
import type { CreateReminderPayload } from '@/types/reminder';

type OpportunityTab = 'overview' | 'access';

const TABS: Array<{ key: OpportunityTab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'access', label: 'Access' },
];

function getCustomerLabel(firstName: string | null, lastName: string | null, company: string | null): string {
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  if (company && fullName) {
    return `${fullName} - ${company}`;
  }
  if (company) {
    return company;
  }
  return fullName || 'Unnamed customer';
}

export function OpportunityDetailPage() {
  const { opportunityId } = useParams<{ opportunityId: string }>();
  const navigate = useNavigate();
  const { employee } = useAuth();
  const {
    selectedOpportunity,
    employeeOptions,
    isDetailLoading,
    isEmployeeOptionsLoading,
    fetchOpportunity,
    fetchEmployeeOptions,
    changeStage,
    grantAccess,
    revokeAccess,
  } = useOpportunities();
  const { createReminder } = useReminders();
  const [activeTab, setActiveTab] = useState<OpportunityTab>('overview');
  const stageModal = useModalState();
  const reminderModal = useModalState();

  useEffect(() => {
    if (opportunityId) {
      fetchOpportunity(opportunityId);
    }
  }, [opportunityId, fetchOpportunity]);

  useEffect(() => {
    if (employee && (employee.role === 'ADMIN' || employee.role === 'SUPER_ADMIN')) {
      fetchEmployeeOptions();
    }
  }, [employee, fetchEmployeeOptions]);

  const accessMeta = useMemo(() => {
    if (!employee || !selectedOpportunity) {
      return { accessLabel: 'View Only', canWrite: false };
    }

    if (employee.role === 'ADMIN' || employee.role === 'SUPER_ADMIN') {
      return { accessLabel: 'Admin', canWrite: true };
    }

    if (selectedOpportunity.createdById === employee.id) {
      return { accessLabel: 'Owner', canWrite: true };
    }

    const entry = selectedOpportunity.accesses.find((access) => access.employeeId === employee.id);
    if (!entry) {
      return { accessLabel: ACCESS_TYPE_LABELS.READ_ONLY, canWrite: false };
    }

    return {
      accessLabel: ACCESS_TYPE_LABELS[entry.accessType],
      canWrite: entry.accessType === 'READ_WRITE',
    };
  }, [employee, selectedOpportunity]);

  if (!employee) {
    return null;
  }

  if (isDetailLoading || !selectedOpportunity) {
    return <LoadingSpinner />;
  }

  const opportunity = selectedOpportunity;
  const isAdminUser = employee.role === 'ADMIN' || employee.role === 'SUPER_ADMIN';
  const opportunitiesBasePath = isAdminUser ? '/admin/dashboard/opportunities' : '/employee/dashboard/opportunities';
  const customerLabel = getCustomerLabel(
    opportunity.customer.firstName,
    opportunity.customer.lastName,
    opportunity.customer.company,
  );

  const handleCreateReminder = async (payload: CreateReminderPayload): Promise<void> => {
    await createReminder(payload);
  };

  const handleStageChange = async (payload: ChangeOpportunityStagePayload): Promise<void> => {
    await changeStage(opportunity.id, payload);
  };

  const handleGrantAccess = async (payload: GrantOpportunityAccessPayload): Promise<void> => {
    await grantAccess(opportunity.id, payload);
  };

  const handleRevokeAccess = async (employeeId: string): Promise<void> => {
    await revokeAccess(opportunity.id, employeeId);
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-5 md:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              className="btn btn-sm mt-0.5 rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50"
              onClick={() => navigate(opportunitiesBasePath)}
              aria-label="Back to opportunities"
            >
              <HiOutlineArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <p className="dashboard-kicker">Opportunity</p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">{opportunity.name}</h2>
              <p className="mt-0.5 text-sm text-slate-500">{customerLabel}</p>
              <p className="mt-1 text-xs text-slate-400">
                Created by {opportunity.createdBy.username} - {new Date(opportunity.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 lg:items-end">
            <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
              {accessMeta.accessLabel}
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              {OPPORTUNITY_STAGE_LABELS[opportunity.stage]}
            </span>
          </div>
        </div>
      </section>

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

      {activeTab === 'overview' ? (
        <>
          <section className="dashboard-panel px-5 py-6 md:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="dashboard-kicker">Pipeline</p>
                <h3 className="dashboard-section-title mt-3">Current progress</h3>
                <p className="dashboard-section-copy mt-3">
                  Move stages quickly, keep notes optional, and retain the full trace of what changed and when.
                </p>
              </div>
              {accessMeta.canWrite ? (
                <button
                  className="btn rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
                  onClick={stageModal.open}
                >
                  Mark New Stage
                </button>
              ) : null}
            </div>

            <div className="mt-6 rounded-[1.75rem] border border-stone-200 bg-stone-50/75 px-4 py-5 md:px-5">
              <OpportunityStageTracker currentStage={opportunity.stage} />
            </div>
          </section>

          <OpportunityActivityFeed entries={opportunity.stageHistory} />
        </>
      ) : null}

      {activeTab === 'access' ? (
        isEmployeeOptionsLoading ? (
          <LoadingSpinner />
        ) : (
          <OpportunityAccessSection
            opportunity={opportunity}
            employees={employeeOptions}
            currentEmployeeId={employee.id}
            canWrite={accessMeta.canWrite}
            onGrant={handleGrantAccess}
            onRevoke={handleRevokeAccess}
          />
        )
      ) : null}

      <OpportunityStageChangeModal
        isOpen={stageModal.isOpen}
        currentStage={opportunity.stage}
        onClose={stageModal.close}
        onSubmit={handleStageChange}
      />

      <button
        type="button"
        aria-label="Create reminder"
        className="fixed bottom-32 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white shadow-[0_10px_24px_rgba(245,158,11,0.36)] transition-transform hover:scale-105 hover:bg-amber-600 active:scale-95"
        onClick={reminderModal.open}
      >
        <HiOutlineBell className="h-6 w-6" />
      </button>

      <CreateReminderModal
        isOpen={reminderModal.isOpen}
        opportunityId={opportunity.id}
        opportunityName={opportunity.name}
        onClose={reminderModal.close}
        onSubmit={handleCreateReminder}
      />
    </div>
  );
}
