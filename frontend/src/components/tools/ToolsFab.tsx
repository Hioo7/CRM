import { useState } from 'react';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { ToolsSheet } from './ToolsSheet';
import { useAuth } from '@/hooks/useAuth';

export function ToolsFab() {
  const { employee } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!employee) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open tools menu"
        className="fixed right-4 top-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-base-100/95 text-emerald-700 shadow-[0_16px_40px_rgba(95,78,59,0.18)] backdrop-blur transition-transform hover:scale-105 hover:text-emerald-800 active:scale-95 md:right-6 md:top-6"
        onClick={() => setIsOpen(true)}
      >
        <HiOutlineWrenchScrewdriver className="h-5 w-5" />
      </button>

      <ToolsSheet
        isOpen={isOpen}
        role={employee.role}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
