import { useState, useEffect, useRef, useCallback } from 'react';
import { ERROR_DISPLAY_DURATION_MS } from '@/config/constants';

export interface ErrorBannerState {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
}

export function useErrorBanner(): ErrorBannerState {
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback((): void => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showError = useCallback((message: string): void => {
    clearTimer();
    setError(message);
    timerRef.current = setTimeout(() => {
      setError(null);
      timerRef.current = null;
    }, ERROR_DISPLAY_DURATION_MS);
  }, [clearTimer]);

  const clearError = useCallback((): void => {
    clearTimer();
    setError(null);
  }, [clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  return { error, showError, clearError };
}
