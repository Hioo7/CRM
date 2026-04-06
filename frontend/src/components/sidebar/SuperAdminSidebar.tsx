import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DASHBOARD_NAV_ITEMS, ROLE_LABELS } from '@/config/constants';

export function SuperAdminSidebar() {
  const { logout, employee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-base-200 p-4 gap-2">
      <div className="mb-4">
        <p className="text-xs text-base-content/50 uppercase tracking-wider mb-1">Signed in as</p>
        <p className="font-semibold text-sm truncate">{employee?.email}</p>
        <p className="text-xs text-primary">{employee ? ROLE_LABELS[employee.role] : ROLE_LABELS.SUPER_ADMIN}</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {DASHBOARD_NAV_ITEMS.map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `btn btn-ghost btn-sm justify-start ${isActive ? 'btn-active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <button className="btn btn-ghost btn-sm justify-start text-error mt-auto" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}
