import { useMemo, useState } from 'react';
import { HiOutlineBriefcase, HiOutlineMagnifyingGlass, HiOutlinePlus } from 'react-icons/hi2';
import { OpportunityCard } from '@/components/opportunities/OpportunityCard';
import { OpportunityCreateModal } from '@/components/opportunities/OpportunityCreateModal';
import { ErrorBanner } from '@/components/ErrorBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { useModalState } from '@/hooks/useModalState';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { CreateOpportunityPayload, OpportunityStage } from '@/types/opportunity';

export function OpportunitiesPage() {
  const { employee } = useAuth();
  const { opportunities, isLoading, createOpportunity, error } = useOpportunities();
  const createModal = useModalState();
  const banner = useErrorBanner();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState<'ALL' | OpportunityStage>('ALL');

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const customerName = [
        opportunity.customer.firstName,
        opportunity.customer.lastName,
        opportunity.customer.company,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch =
        !query ||
        opportunity.name.toLowerCase().includes(query) ||
        customerName.includes(query) ||
        opportunity.createdBy.username.toLowerCase().includes(query);
      const matchesStage = stageFilter === 'ALL' || opportunity.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  }, [opportunities, search, stageFilter]);

  if (!employee) {
    return null;
  }

  const wrappedCreate = async (payload: CreateOpportunityPayload): Promise<void> => {
    try {
      await createOpportunity(payload);
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
      throw err;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-5 md:px-7 md:py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="dashboard-kicker">Opportunities</p>
            <h2 className="dashboard-section-title mt-3">Pipeline in motion</h2>
            {opportunities.length > 0 ? (
              <p className="dashboard-section-copy mt-2">
                {opportunities.length} active opportunity{opportunities.length === 1 ? '' : 'ies'}
              </p>
            ) : (
              <p className="dashboard-section-copy mt-2">
                Create and move opportunities quickly.
              </p>
            )}
          </div>
          <button
            className="btn shrink-0 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
            onClick={createModal.open}
          >
            <HiOutlinePlus className="h-5 w-5" />
            <span className="hidden sm:inline">Create Opportunity</span>
          </button>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
          <label className="form-control">
            <span className="mb-1.5 text-sm font-semibold text-slate-700">Search</span>
            <div className="relative">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input h-11 w-full rounded-2xl border-stone-200 bg-stone-50/70 pl-11 text-slate-900"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search opportunities, customers, or creators"
              />
            </div>
          </label>

          <label className="form-control">
            <span className="mb-1.5 text-sm font-semibold text-slate-700">Stage</span>
            <select
              className="select h-11 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value as 'ALL' | OpportunityStage)}
            >
              <option value="ALL">All stages</option>
              {OPPORTUNITY_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {OPPORTUNITY_STAGE_LABELS[stage]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <ErrorBanner message={banner.error ?? error} />

      {filteredOpportunities.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <HiOutlineBriefcase className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-900">No opportunities yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            Start by creating an opportunity for an existing customer or create the customer inline first.
          </p>
          <button
            className="btn mt-6 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
            onClick={createModal.open}
          >
            <HiOutlinePlus className="h-5 w-5" />
            Create Opportunity
          </button>
        </section>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              currentEmployeeId={employee.id}
            />
          ))}
        </div>
      )}

      <OpportunityCreateModal
        isOpen={createModal.isOpen}
        onClose={createModal.close}
        onSubmit={wrappedCreate}
      />
    </div>
  );
}
