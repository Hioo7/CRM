export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'EMPLOYEE';

export interface AuthEmployee {
  id: string;
  username: string;
  email: string;
  role: Role;
}

export interface Employee {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employee: AuthEmployee;
}
