import { useContext } from 'react';
import { OpportunityContext } from '@/contexts/OpportunityContext';

export function useOpportunities() {
  const ctx = useContext(OpportunityContext);
  if (!ctx) {
    throw new Error('useOpportunities must be used within OpportunityProvider');
  }
  return ctx;
}
