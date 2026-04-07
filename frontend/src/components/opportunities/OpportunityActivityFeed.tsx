import { OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { OpportunityStageHistoryEntry } from '@/types/opportunity';

interface OpportunityActivityFeedProps {
  entries: OpportunityStageHistoryEntry[];
}

export function OpportunityActivityFeed({ entries }: OpportunityActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <section className="dashboard-panel px-5 py-6 md:px-7">
        <p className="text-sm text-slate-500">No stage history yet.</p>
      </section>
    );
  }

  return (
    <section className="dashboard-panel overflow-hidden">
      <div className="border-b border-stone-200/80 px-5 py-4 md:px-7">
        <p className="dashboard-kicker">Activity</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">Stage history and notes</h3>
      </div>

      <div className="divide-y divide-stone-100">
        {entries.map((entry) => (
          <article key={entry.id} className="px-5 py-5 md:px-7">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {entry.fromStage
                    ? `${OPPORTUNITY_STAGE_LABELS[entry.fromStage]} to ${OPPORTUNITY_STAGE_LABELS[entry.toStage]}`
                    : `Created in ${OPPORTUNITY_STAGE_LABELS[entry.toStage]}`}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {entry.changedBy.username} · {new Date(entry.changedAt).toLocaleString()}
                </p>
              </div>
              <span className="w-fit rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                {OPPORTUNITY_STAGE_LABELS[entry.toStage]}
              </span>
            </div>

            {entry.notes ? (
              <div className="mt-4 rounded-2xl border border-stone-200 bg-stone-50/80 px-4 py-3 text-sm leading-6 text-slate-700">
                {entry.notes}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">No notes added for this change.</p>
            )}

            {entry.noteEdits.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                  Note edits
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  {entry.noteEdits.map((noteEdit) => (
                    <div key={noteEdit.id} className="rounded-2xl bg-white/90 px-4 py-3 shadow-sm">
                      <p className="text-xs text-slate-400">
                        Edited by {noteEdit.editedBy.username} · {new Date(noteEdit.editedAt).toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {noteEdit.newNotes?.trim() || 'Notes cleared'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
