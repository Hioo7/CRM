import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBriefcase,
  HiOutlineCheckBadge,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi2';
import { useAdminMonitoring } from '@/hooks/useAdminMonitoring';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminActivityFeed } from '@/components/admin/AdminActivityFeed';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { OpportunityStage } from '@/types/opportunity';

function getStagePillClass(stage: OpportunityStage): string {
  switch (stage) {
    case 'CLOSED_WON':
    case 'ACTIVE_RETENTION':
      return 'border-emerald-200 bg-emerald-50 text-emerald-800';
    case 'NEGOTIATION':
    case 'PROPOSAL_DEMO':
    case 'ONBOARDING':
      return 'border-amber-200 bg-amber-50 text-amber-800';
    case 'CHURNED_CLOSED_LOST':
      return 'border-rose-200 bg-rose-50 text-rose-800';
    default:
      return 'border-sky-200 bg-sky-50 text-sky-800';
  }
}

export function OverviewPage() {
  const { overview, recentActivity, isOverviewLoading, isActivityLoading, fetchOverview, fetchRecentActivity } =
    useAdminMonitoring();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOverview();
    fetchRecentActivity();
  }, [fetchOverview, fetchRecentActivity]);

  if (isOverviewLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <p className="dashboard-kicker">Overview</p>
        <h2 className="dashboard-section-title mt-3">At a glance</h2>
        <p className="dashboard-section-copy mt-2">
          A snapshot of your team's reach and pipeline health.
        </p>
      </section>

      {overview && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <AdminStatCard
              icon={HiOutlineUsers}
              label="Team members"
              value={overview.employeeCount}
              tone="neutral"
            />
            <AdminStatCard
              icon={HiOutlineUserGroup}
              label="Total customers"
              value={overview.customerCount}
              tone="sky"
            />
            <AdminStatCard
              icon={HiOutlineBriefcase}
              label="Open opportunities"
              value={overview.openOpportunityCount}
              tone="amber"
            />
            <AdminStatCard
              icon={HiOutlineCheckBadge}
              label="Closed won"
              value={overview.closedWonCount}
              tone="emerald"
            />
          </div>

          {overview.opportunitiesByStage.length > 0 && (
            <section className="dashboard-card px-5 py-5">
              <p className="dashboard-kicker mb-4">Pipeline Breakdown</p>
              <div className="flex flex-wrap gap-2">
                {overview.opportunitiesByStage.map(({ stage, count }) => (
                  <button
                    key={stage}
                    type="button"
                    onClick={() =>
                      navigate(`/admin/dashboard/opportunities?stage=${stage}`)
                    }
                    className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-80 ${getStagePillClass(stage as OpportunityStage)}`}
                  >
                    <span className="uppercase tracking-wide">
                      {OPPORTUNITY_STAGE_LABELS[stage as OpportunityStage]}
                    </span>
                    <span className="tabular-nums">{count}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="dashboard-card px-5 py-5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="dashboard-kicker">Recent Activity</p>
          <span className="text-xs text-slate-400">Last 30 changes</span>
        </div>
        {isActivityLoading ? (
          <LoadingSpinner />
        ) : (
          <AdminActivityFeed
            entries={recentActivity}
            showEmployee
            opportunityBasePath="/admin/dashboard/opportunities"
          />
        )}
      </section>
    </div>
  );
}
