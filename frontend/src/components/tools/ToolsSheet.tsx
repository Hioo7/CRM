import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBolt,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineXMark,
} from 'react-icons/hi2';
import type { Role } from '@/types/auth';

interface ToolItem {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  to: string;
}

interface ToolsSheetProps {
  isOpen: boolean;
  role: Role;
  onClose: () => void;
}

function getToolItems(role: Role): ToolItem[] {
  const quickMessagesItem: ToolItem = {
    label: 'Quick Messages',
    description: 'Generate customer-ready messages fast.',
    icon: HiOutlineBolt,
    to:
      role === 'ADMIN'
        ? '/admin/dashboard/tools/quick-messages'
        : role === 'SUPER_ADMIN'
          ? '/super-admin/dashboard/tools/quick-messages'
          : '/employee/dashboard/tools/quick-messages',
  };

  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return [
      quickMessagesItem,
      {
        label: 'New Template',
        description: 'Create a new reusable quick message template.',
        icon: HiOutlineSparkles,
        to: `${quickMessagesItem.to}?composer=new`,
      },
    ];
  }

  return [quickMessagesItem];
}

export function ToolsSheet({ isOpen, role, onClose }: ToolsSheetProps) {
  const navigate = useNavigate();
  const toolItems = getToolItems(role);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="pointer-events-auto fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close tools menu"
      />

      <aside className="absolute right-4 top-20 w-[min(22rem,calc(100vw-2rem))] rounded-[2rem] border border-white/85 bg-base-100/95 p-4 shadow-[0_24px_80px_rgba(95,78,59,0.2)] backdrop-blur">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="dashboard-kicker">Tools</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-900">Fast actions</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Keep message work close without expanding the main navigation.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-600 shadow-none hover:bg-stone-50"
            onClick={onClose}
            aria-label="Close tools menu"
          >
            <HiOutlineXMark className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {toolItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className="flex items-start gap-3 rounded-[1.5rem] border border-stone-200/80 bg-white px-4 py-4 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50/60"
                onClick={() => {
                  navigate(item.to);
                  onClose();
                }}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-stone-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <HiOutlineSquares2X2 className="h-4 w-4 text-slate-300" />
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
