export type AccessType = 'READ_ONLY' | 'READ_WRITE';

export interface CustomerCreatedBy {
  id: string;
  username: string;
}

export interface CustomerAccessEmployee {
  id: string;
  username: string;
  email: string;
}

export interface CustomerAccessEntry {
  id: string;
  employeeId: string;
  accessType: AccessType;
  employee: CustomerAccessEmployee;
}

export interface CustomerListAccess {
  employeeId: string;
  accessType: AccessType;
}

export interface CustomerListItem {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  instagramHandle: string | null;
  linkedinProfileUrl: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: CustomerCreatedBy;
  customerAccesses: CustomerListAccess[];
}

export interface CustomerDetail extends Omit<CustomerListItem, 'customerAccesses'> {
  customerAccesses: CustomerAccessEntry[];
}

export interface CreateCustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
}

export interface UpdateCustomerPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  instagramHandle?: string;
  linkedinProfileUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  company?: string;
  notes?: string;
}

export interface GrantAccessPayload {
  employeeId: string;
  accessType: AccessType;
}
