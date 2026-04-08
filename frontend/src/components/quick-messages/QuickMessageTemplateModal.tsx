import { useRef, useState } from 'react';
import { ErrorBanner } from '@/components/ErrorBanner';
import { QUICK_MESSAGE_PLATFORM_LABELS, QUICK_MESSAGE_PLATFORMS } from '@/config/constants';
import { QuickMessagePlaceholderAutocomplete } from './QuickMessagePlaceholderAutocomplete';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import type {
  CreateQuickMessageTemplatePayload,
  QuickMessagePlaceholderMeta,
  QuickMessageTemplate,
} from '@/types/quickMessage';

interface QuickMessageTemplateModalProps {
  isOpen: boolean;
  placeholders: QuickMessagePlaceholderMeta[];
  template?: QuickMessageTemplate | null;
  onClose: () => void;
  onSubmit: (payload: CreateQuickMessageTemplatePayload) => Promise<void>;
}

interface TemplateFormState {
  name: string;
  platform: CreateQuickMessageTemplatePayload['platform'];
  content: string;
}

function getInitialState(template?: QuickMessageTemplate | null): TemplateFormState {
  return {
    name: template?.name ?? '',
    platform: template?.platform ?? 'WHATSAPP',
    content: template?.content ?? '',
  };
}

export function QuickMessageTemplateModal({
  isOpen,
  placeholders,
  template,
  onClose,
  onSubmit,
}: QuickMessageTemplateModalProps) {
  const banner = useErrorBanner();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [form, setForm] = useState<TemplateFormState>(getInitialState(template));
  const [caretIndex, setCaretIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const currentToken = form.content.slice(0, caretIndex).match(/#[A-Za-z0-9]*$/)?.[0] ?? null;
  const suggestions = currentToken
    ? placeholders.filter((placeholder) =>
        placeholder.token.toLowerCase().startsWith(currentToken.toLowerCase()),
      )
    : [];

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    onClose();
  };

  const insertPlaceholder = (placeholder: QuickMessagePlaceholderMeta): void => {
    if (!textareaRef.current) {
      return;
    }

    const token = currentToken ?? '#';
    const tokenStartIndex = caretIndex - token.length;
    const beforeToken = form.content.slice(0, tokenStartIndex);
    const afterToken = form.content.slice(caretIndex);
    const needsLeadingSpace = beforeToken.length > 0 && !/\s$/.test(beforeToken);
    const needsTrailingSpace = afterToken.length === 0 || !/^\s/.test(afterToken);
    const insertedToken = `${needsLeadingSpace ? ' ' : ''}${placeholder.token}${needsTrailingSpace ? ' ' : ''}`;
    const nextContent = `${beforeToken}${insertedToken}${afterToken}`;
    const nextCaretIndex = beforeToken.length + insertedToken.length;

    setForm((prev) => ({ ...prev, content: nextContent }));
    setCaretIndex(nextCaretIndex);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCaretIndex, nextCaretIndex);
    });
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!form.name.trim()) {
      banner.showError('Template name is required.');
      return;
    }

    if (!form.content.trim()) {
      banner.showError('Template content is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        platform: form.platform,
        content: form.content,
      });
      handleClose();
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-h-[calc(100vh-2rem)] max-w-2xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
        <div className="border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
          <p className="dashboard-kicker">Templates</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {template ? 'Edit quick message template' : 'Create quick message template'}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use exact customer placeholders such as <span className="font-mono">#firstName</span> and <span className="font-mono">#company</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-6">
          <ErrorBanner message={banner.error} />

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Template name</span>
            <input
              type="text"
              className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Warm intro follow-up"
            />
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Platform</span>
            <select
              className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
              value={form.platform}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  platform: event.target.value as CreateQuickMessageTemplatePayload['platform'],
                }))
              }
            >
              {QUICK_MESSAGE_PLATFORMS.map((platform) => (
                <option key={platform} value={platform}>
                  {QUICK_MESSAGE_PLATFORM_LABELS[platform]}
                </option>
              ))}
            </select>
          </label>

          <label className="form-control">
            <span className="mb-2 text-sm font-semibold text-slate-700">Message content</span>
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="textarea min-h-40 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                value={form.content}
                onChange={(event) => {
                  setForm((prev) => ({ ...prev, content: event.target.value }));
                  setCaretIndex(event.target.selectionStart ?? event.target.value.length);
                }}
                onClick={(event) => setCaretIndex(event.currentTarget.selectionStart ?? form.content.length)}
                onKeyUp={(event) => setCaretIndex(event.currentTarget.selectionStart ?? form.content.length)}
                placeholder="Hi #firstName #lastName, how are you?"
              />

              <QuickMessagePlaceholderAutocomplete
                suggestions={suggestions}
                onSelect={insertPlaceholder}
                className="absolute inset-x-3 bottom-3 z-20"
              />
            </div>
          </label>

          <div className="rounded-[1.4rem] border border-stone-200 bg-stone-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Available placeholders
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {placeholders.map((placeholder) => (
                <button
                  key={placeholder.token}
                  type="button"
                  className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => insertPlaceholder(placeholder)}
                >
                  {placeholder.token}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : template ? 'Save Changes' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={handleClose}>close</button>
      </form>
    </dialog>
  );
}
