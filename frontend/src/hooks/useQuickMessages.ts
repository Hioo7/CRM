import { useContext } from 'react';
import { QuickMessageContext, type QuickMessageContextValue } from '@/contexts/QuickMessageContext';

export function useQuickMessages(): QuickMessageContextValue {
  const ctx = useContext(QuickMessageContext);
  if (!ctx) {
    throw new Error('useQuickMessages must be used within QuickMessageProvider');
  }

  return ctx;
}
