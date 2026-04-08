interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmModal({ isOpen, title, description, confirmLabel, onConfirm, onClose }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] w-[calc(100vw-1.5rem)] max-w-md overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="border-b border-red-100 bg-red-50/80 px-5 py-4 md:px-6 md:py-5">
          <p className="dashboard-kicker text-red-700/80">Confirm</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
        </div>

        <div className="px-5 py-5 md:px-6 md:py-6">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn w-full rounded-2xl border-0 bg-red-600 text-white shadow-[0_10px_24px_rgba(220,38,38,0.24)] hover:bg-red-700 sm:w-auto"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          close
        </button>
      </form>
    </dialog>
  );
}
