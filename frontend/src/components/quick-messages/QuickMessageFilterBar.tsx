import { QUICK_MESSAGE_PLATFORM_LABELS } from '@/config/constants';
import type { QuickMessagePlatform } from '@/types/quickMessage';

interface QuickMessageFilterBarProps {
  availablePlatforms: QuickMessagePlatform[];
  selectedPlatform: QuickMessagePlatform | 'ALL';
  onSelect: (platform: QuickMessagePlatform | 'ALL') => void;
}

export function QuickMessageFilterBar({
  availablePlatforms,
  selectedPlatform,
  onSelect,
}: QuickMessageFilterBarProps) {
  const options: Array<QuickMessagePlatform | 'ALL'> = ['ALL', ...availablePlatforms];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((platform) => (
        <button
          key={platform}
          type="button"
          className={[
            'shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
            selectedPlatform === platform
              ? 'border-emerald-300 bg-emerald-600 text-white shadow-[0_6px_16px_rgba(5,150,105,0.2)]'
              : 'border-stone-200 bg-white text-slate-700 hover:bg-stone-50',
          ].join(' ')}
          onClick={() => onSelect(platform)}
        >
          {platform === 'ALL' ? 'All' : QUICK_MESSAGE_PLATFORM_LABELS[platform]}
        </button>
      ))}
    </div>
  );
}
