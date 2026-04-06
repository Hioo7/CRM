import httpClient from './httpClient';
import type { Employee } from '@/types/auth';
import type { CreateEmployeePayload, UpdateEmployeePayload } from '@/types/employee';

export const employeeService = {
  async listAll(): Promise<Employee[]> {
    const { data } = await httpClient.get<Employee[]>('/employees');
    return data;
  },

  async create(payload: CreateEmployeePayload): Promise<Employee> {
    const { data } = await httpClient.post<Employee>('/employees', payload);
    return data;
  },

  async update(id: string, payload: UpdateEmployeePayload): Promise<Employee> {
    const { data } = await httpClient.patch<Employee>(`/employees/${id}`, payload);
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(`/employees/${id}`);
  },
};
