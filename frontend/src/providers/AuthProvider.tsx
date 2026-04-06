import { useState, useCallback, type ReactNode } from 'react';
import { AuthContext, type AuthState } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import { decodeJwtPayload, isTokenExpired } from '@/utils/jwt';
import { AUTH_TOKEN_KEY } from '@/config/constants';
import type { LoginPayload } from '@/types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

function hydrateFromStorage(): AuthState {
  const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
  if (storedToken) {
    try {
      const payload = decodeJwtPayload(storedToken);
      if (!isTokenExpired(payload)) {
        return {
          employee: { id: payload.sub, username: payload.username, role: payload.role, email: '' },
          token: storedToken,
          isLoading: false,
        };
      }
    } catch {
      // malformed token — fall through to clear it
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
  return { employee: null, token: null, isLoading: false };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(hydrateFromStorage);

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const response = await authService.login(payload);
    localStorage.setItem(AUTH_TOKEN_KEY, response.token);
    setState({ employee: response.employee, token: response.token, isLoading: false });
  }, []);

  const logout = useCallback((): void => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setState({ employee: null, token: null, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
