import type { Role } from '@/types/auth';

export interface JwtTokenPayload {
  sub: string;
  username: string;
  role: Role;
  iat: number;
  exp: number;
}

export function decodeJwtPayload(token: string): JwtTokenPayload {
  const segment = token.split('.')[1];
  const padded = segment.replace(/-/g, '+').replace(/_/g, '/');
  const json = atob(padded);
  return JSON.parse(json) as JwtTokenPayload;
}

export function isTokenExpired(payload: JwtTokenPayload): boolean {
  return Date.now() >= payload.exp * 1000;
}
