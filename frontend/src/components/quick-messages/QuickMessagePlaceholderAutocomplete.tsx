import type { QuickMessagePlaceholderMeta } from '@/types/quickMessage';

interface QuickMessagePlaceholderAutocompleteProps {
  suggestions: QuickMessagePlaceholderMeta[];
  onSelect: (suggestion: QuickMessagePlaceholderMeta) => void;
  className?: string;
}

export function QuickMessagePlaceholderAutocomplete({
  suggestions,
  onSelect,
  className,
}: QuickMessagePlaceholderAutocompleteProps) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div
      className={[
        'rounded-[1.2rem] border border-emerald-100 bg-white/95 p-2 shadow-[0_14px_35px_rgba(95,78,59,0.14)] backdrop-blur',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex max-h-52 flex-col gap-1 overflow-y-auto">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.token}
            type="button"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-left transition-colors hover:bg-emerald-50"
            onClick={() => onSelect(suggestion)}
          >
            <span className="font-mono text-sm font-semibold text-emerald-800">
              {suggestion.token}
            </span>
            <span className="text-xs text-slate-500">{suggestion.field}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
