import { useState, useEffect, useCallback } from 'react';
import { meService } from '@/services/meService';
import { extractApiErrorMessage } from '@/utils/errors';
import type { Employee } from '@/types/auth';
import type { UpdateSelfPayload } from '@/types/employee';

export interface ProfileState {
  profile: Employee | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (payload: UpdateSelfPayload) => Promise<void>;
}

export function useProfile(): ProfileState {
  const [profile, setProfile] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    meService.getProfile()
      .then((data) => { if (!cancelled) setProfile(data); })
      .catch((err: Error) => { if (!cancelled) setError(extractApiErrorMessage(err)); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const updateProfile = useCallback(async (payload: UpdateSelfPayload): Promise<void> => {
    const updated = await meService.updateProfile(payload);
    setProfile(updated);
  }, []);

  return { profile, isLoading, error, updateProfile };
}
