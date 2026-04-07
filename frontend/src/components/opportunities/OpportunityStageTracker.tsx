import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { OpportunityStage } from '@/types/opportunity';

interface OpportunityStageTrackerProps {
  currentStage: OpportunityStage;
  compact?: boolean;
}

export function OpportunityStageTracker({
  currentStage,
  compact = false,
}: OpportunityStageTrackerProps) {
  const currentIndex = OPPORTUNITY_STAGES.indexOf(currentStage);

  return (
    <div className={compact ? 'overflow-x-auto pb-1' : ''}>
      <div className={`flex gap-2 ${compact ? 'min-w-max' : 'flex-wrap'}`}>
        {OPPORTUNITY_STAGES.map((stage, index) => {
          const isPast = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={stage}
              className={[
                'rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-colors',
                isCurrent
                  ? 'border-emerald-300 bg-emerald-600 text-white shadow-[0_8px_20px_rgba(5,150,105,0.24)]'
                  : isPast
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-stone-200 bg-white text-slate-400',
              ].join(' ')}
            >
              {OPPORTUNITY_STAGE_LABELS[stage]}
            </div>
          );
        })}
      </div>
    </div>
  );
}
