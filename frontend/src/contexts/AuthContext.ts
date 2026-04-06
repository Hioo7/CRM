import { createContext } from 'react';
import type { AuthEmployee, LoginPayload } from '@/types/auth';

export interface AuthState {
  employee: AuthEmployee | null;
  token: string | null;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
