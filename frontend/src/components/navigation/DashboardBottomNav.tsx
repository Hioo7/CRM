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
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <nav
        className="pointer-events-auto mx-auto grid max-w-2xl gap-1.5 rounded-[1.9rem] border border-white/85 bg-base-100/92 p-1.5 shadow-[0_-12px_38px_rgba(95,78,59,0.18)] backdrop-blur sm:gap-2 sm:p-2"
        style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}
      >
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                'flex min-h-16 min-w-0 flex-col items-center justify-center rounded-2xl px-2 py-2 text-center transition-colors sm:px-3',
                isActive
                  ? 'bg-emerald-600 text-white shadow-[0_12px_24px_rgba(5,150,105,0.28)]'
                  : 'bg-transparent text-slate-500 hover:bg-stone-100 hover:text-slate-900',
              ].join(' ')
            }
          >
            <Icon className="mb-1 h-6 w-6 shrink-0" />
            <span className="block max-w-full text-[0.58rem] font-semibold uppercase leading-tight tracking-[0.1em] sm:text-[0.68rem] sm:tracking-[0.16em]">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
