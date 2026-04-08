import { useNavigate } from 'react-router-dom';
import { AdminActivityFeedItem } from '@/components/admin/AdminActivityFeedItem';
import type { ActivityEntry } from '@/types/admin';

interface AdminActivityFeedProps {
  entries: ActivityEntry[];
  showEmployee: boolean;
  opportunityBasePath: string;
}

export function AdminActivityFeed({
  entries,
  showEmployee,
  opportunityBasePath,
}: AdminActivityFeedProps) {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <p className="text-sm text-slate-500">No activity recorded yet.</p>
      </div>
    );
  }

  const handleOpportunityClick = (opportunityId: string): void => {
    navigate(`${opportunityBasePath}/${opportunityId}`);
  };

  return (
    <div className="divide-y divide-stone-100">
      {entries.map((entry) => (
        <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
          <AdminActivityFeedItem
            entry={entry}
            showEmployee={showEmployee}
            onOpportunityClick={handleOpportunityClick}
          />
        </div>
      ))}
    </div>
  );
}
