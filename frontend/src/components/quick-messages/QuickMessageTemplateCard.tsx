import { HiOutlineBolt, HiOutlinePencilSquare, HiOutlineTrash } from 'react-icons/hi2';
import { QUICK_MESSAGE_PLATFORM_LABELS } from '@/config/constants';
import type { QuickMessageTemplate } from '@/types/quickMessage';

interface QuickMessageTemplateCardProps {
  template: QuickMessageTemplate;
  canManage: boolean;
  onCreate: (template: QuickMessageTemplate) => void;
  onEdit: (template: QuickMessageTemplate) => void;
  onDelete: (template: QuickMessageTemplate) => void;
}

export function QuickMessageTemplateCard({
  template,
  canManage,
  onCreate,
  onEdit,
  onDelete,
}: QuickMessageTemplateCardProps) {
  return (
    <article className="dashboard-card flex flex-col gap-4 px-5 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-900">{template.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700/85">
            {QUICK_MESSAGE_PLATFORM_LABELS[template.platform]}
          </p>
        </div>
        <span className="rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-slate-700">
          {template.platform}
        </span>
      </div>

      <div className="rounded-[1.4rem] border border-stone-200/80 bg-stone-50/80 px-4 py-4">
        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {template.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn flex-1 rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_6px_16px_rgba(5,150,105,0.22)] hover:bg-emerald-700"
          onClick={() => onCreate(template)}
        >
          <HiOutlineBolt className="h-4 w-4" />
          Create
        </button>
        {canManage ? (
          <button
            type="button"
            className="btn rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50"
            onClick={() => onEdit(template)}
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
            Edit
          </button>
        ) : null}
        {canManage ? (
          <button
            type="button"
            className="btn rounded-2xl border border-red-200 bg-red-50 text-red-700 shadow-none hover:bg-red-100"
            onClick={() => onDelete(template)}
          >
            <HiOutlineTrash className="h-4 w-4" />
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}
