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
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4 text-base-content/70">{description}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-error" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose} />
    </dialog>
  );
}
