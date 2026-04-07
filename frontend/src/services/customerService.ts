import httpClient from './httpClient';
import type {
  CustomerListItem,
  CustomerDetail,
  CreateCustomerPayload,
  UpdateCustomerPayload,
  GrantAccessPayload,
  CustomerAccessEntry,
} from '@/types/customer';

export const customerService = {
  async list(): Promise<CustomerListItem[]> {
    const { data } = await httpClient.get<CustomerListItem[]>('/customers');
    return data;
  },

  async getById(id: string): Promise<CustomerDetail> {
    const { data } = await httpClient.get<CustomerDetail>(`/customers/${id}`);
    return data;
  },

  async create(payload: CreateCustomerPayload): Promise<CustomerListItem> {
    const { data } = await httpClient.post<CustomerListItem>('/customers', payload);
    return data;
  },

  async update(id: string, payload: UpdateCustomerPayload): Promise<CustomerDetail> {
    const { data } = await httpClient.patch<CustomerDetail>(`/customers/${id}`, payload);
    return data;
  },

  async grantAccess(customerId: string, payload: GrantAccessPayload): Promise<CustomerAccessEntry> {
    const { data } = await httpClient.post<CustomerAccessEntry>(
      `/customers/${customerId}/access`,
      payload,
    );
    return data;
  },

  async revokeAccess(customerId: string, employeeId: string): Promise<void> {
    await httpClient.delete(`/customers/${customerId}/access/${employeeId}`);
  },
};
