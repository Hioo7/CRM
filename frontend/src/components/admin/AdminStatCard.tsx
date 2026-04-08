interface AdminStatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone?: 'emerald' | 'amber' | 'sky' | 'neutral';
}

const TONE_CLASSES: Record<string, { icon: string; bg: string }> = {
  emerald: { icon: 'text-emerald-700', bg: 'bg-emerald-100' },
  amber: { icon: 'text-amber-700', bg: 'bg-amber-100' },
  sky: { icon: 'text-sky-700', bg: 'bg-sky-100' },
  neutral: { icon: 'text-slate-600', bg: 'bg-stone-100' },
};

export function AdminStatCard({ icon: Icon, label, value, tone = 'neutral' }: AdminStatCardProps) {
  const { icon: iconClass, bg: bgClass } = TONE_CLASSES[tone];

  return (
    <div className="dashboard-card flex items-center gap-4 px-5 py-5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${bgClass} ${iconClass}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-semibold tabular-nums text-slate-900">{value.toLocaleString()}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}
