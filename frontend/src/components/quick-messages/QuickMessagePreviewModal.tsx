import { useState } from 'react';
import { HiOutlineClipboardDocument } from 'react-icons/hi2';
import { ErrorBanner } from '@/components/ErrorBanner';
import { QUICK_MESSAGE_PLATFORM_LABELS } from '@/config/constants';
import { buildRenderedMessageSegments } from '@/utils/quickMessages';
import type { RenderQuickMessageResponse } from '@/types/quickMessage';

interface QuickMessagePreviewModalProps {
  isOpen: boolean;
  preview: RenderQuickMessageResponse | null;
  onClose: () => void;
}

export function QuickMessagePreviewModal({
  isOpen,
  preview,
  onClose,
}: QuickMessagePreviewModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !preview) {
    return null;
  }

  const segments = buildRenderedMessageSegments(
    preview.renderedContent,
    preview.unresolvedPlaceholders,
  );

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(preview.renderedContent);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <p className="dashboard-kicker">Ready</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {QUICK_MESSAGE_PLATFORM_LABELS[preview.platform]} quick message
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Copy this and send it. Any unresolved fields remain highlighted so they are easy to spot.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-6 py-6">
          {preview.unresolvedPlaceholders.length > 0 ? (
            <ErrorBanner
              message={`Missing customer values for ${preview.unresolvedPlaceholders.join(', ')}.`}
            />
          ) : null}

          <section className="rounded-[1.6rem] border border-stone-200 bg-white px-5 py-5 shadow-sm">
            <div className="whitespace-pre-wrap text-[0.96rem] leading-7 text-slate-800">
              {segments.map((segment, index) => (
                <span
                  key={`${segment.value}-${index}`}
                  className={
                    segment.isUnresolved
                      ? 'rounded bg-red-100 px-1 py-0.5 font-semibold text-red-700'
                      : ''
                  }
                >
                  {segment.value}
                </span>
              ))}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              onClick={() => void handleCopy()}
            >
              <HiOutlineClipboardDocument className="h-5 w-5" />
              {copied ? 'Copied' : 'Copy Message'}
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
