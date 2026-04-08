import { NavLink } from 'react-router-dom';

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardBottomNavProps {
  navItems: NavItem[];
}

export function DashboardBottomNav({ navItems }: DashboardBottomNavProps) {
  const itemCount = navItems.length;
  const hasManyItems = itemCount >= 5;
  const hasExtraManyItems = itemCount >= 6;

  return (
    <div className="pointer-events-none fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2">
      <nav
        className="pointer-events-auto mx-auto grid w-full gap-1.5 rounded-[1.9rem] border border-white/85 bg-base-100/92 p-1.5 shadow-[0_-12px_38px_rgba(95,78,59,0.18)] backdrop-blur sm:gap-2 sm:p-2"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                hasExtraManyItems
                  ? 'flex min-h-[3.5rem] min-w-0 flex-col items-center justify-center rounded-2xl px-1 py-1.5 text-center transition-colors sm:min-h-[3.9rem] sm:px-1.5'
                  : hasManyItems
                    ? 'flex min-h-[3.75rem] min-w-0 flex-col items-center justify-center rounded-2xl px-1.5 py-1.5 text-center transition-colors sm:min-h-[4.1rem] sm:px-2'
                    : 'flex min-h-16 min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition-colors sm:px-3',
                isActive
                  ? 'bg-emerald-600 text-white shadow-[0_12px_24px_rgba(5,150,105,0.28)]'
                  : 'bg-transparent text-slate-500 hover:bg-stone-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            <Icon
              className={
                hasExtraManyItems
                  ? 'mb-1 h-[1.125rem] w-[1.125rem] shrink-0 sm:h-5 sm:w-5'
                  : hasManyItems
                    ? 'mb-1 h-5 w-5 shrink-0 sm:h-[1.375rem] sm:w-[1.375rem]'
                    : 'mb-1 h-6 w-6 shrink-0'
              }
            />
            <span
              className={
                hasExtraManyItems
                  ? 'block max-w-full text-[0.48rem] font-semibold uppercase leading-tight tracking-[0.04em] sm:text-[0.56rem] sm:tracking-[0.08em]'
                  : hasManyItems
                    ? 'block max-w-full text-[0.52rem] font-semibold uppercase leading-tight tracking-[0.06em] sm:text-[0.61rem] sm:tracking-[0.1em]'
                    : 'block max-w-full text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.1em] sm:text-[0.68rem] sm:tracking-[0.16em]'
              }
            >
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
