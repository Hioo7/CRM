import { NavLink } from 'react-router-dom';
import { HiOutlineUserCircle, HiOutlineUsers } from 'react-icons/hi2';
import { DASHBOARD_NAV_ITEMS } from '@/config/constants';

const navIcons = {
  Users: HiOutlineUsers,
  Profile: HiOutlineUserCircle,
} as const;

export function DashboardBottomNav() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4">
      <nav className="pointer-events-auto mx-auto grid max-w-xl grid-cols-2 gap-2 rounded-[1.9rem] border border-white/85 bg-base-100/92 p-2 shadow-[0_-12px_38px_rgba(95,78,59,0.18)] backdrop-blur">
        {DASHBOARD_NAV_ITEMS.map(({ label, to }) => {
          const Icon = navIcons[label];

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  'flex min-h-16 flex-col items-center justify-center rounded-2xl px-3 py-2 text-center transition-colors',
                  isActive
                    ? 'bg-emerald-600 text-white shadow-[0_12px_24px_rgba(5,150,105,0.28)]'
                    : 'bg-transparent text-slate-500 hover:bg-stone-100 hover:text-slate-900',
                ].join(' ')
              }
            >
              <Icon className="mb-1 h-6 w-6 shrink-0" />
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em]">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
