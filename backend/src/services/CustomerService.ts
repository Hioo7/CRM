import { AccessType, Customer, CustomerAccess, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';
import { CreateCustomerDto, UpdateCustomerDto } from '../schema/customer.schema';
import { GrantCustomerAccessDto } from '../schema/customer-access.schema';

export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  async create(createdById: string, dto: CreateCustomerDto): Promise<Customer> {
    if (dto.email) {
      const existing = await prisma.customer.findUnique({ where: { email: dto.email } });
      if (existing) {
        throw new AppError(409, 'A customer with this email already exists');
      }
    }

    return prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: { ...dto, createdById },
      });

      await tx.customerAccess.create({
        data: {
          customerId: customer.id,
          employeeId: createdById,
          accessType: AccessType.READ_WRITE,
        },
      });

      return customer;
    });
  }

  async findAll(employeeId: string, role: Role): Promise<Customer[]> {
    if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
      return prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
    }

    return prisma.customer.findMany({
      where: { customerAccesses: { some: { employeeId } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Customer> {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Customer not found');
    }

    if (dto.email && dto.email !== existing.email) {
      const emailTaken = await prisma.customer.findUnique({ where: { email: dto.email } });
      if (emailTaken) {
        throw new AppError(409, 'A customer with this email already exists');
      }
    }

    return prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Customer not found');
    }

    await prisma.customer.delete({ where: { id } });
  }

  async grantAccess(
    customerId: string,
    dto: GrantCustomerAccessDto,
  ): Promise<CustomerAccess> {
    const customer = await prisma.customer.findUnique({ where: { id: customerId } });
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }

    const employee = await prisma.employee.findUnique({ where: { id: dto.employeeId } });
    if (!employee) {
      throw new AppError(404, 'Employee not found');
    }

    return prisma.customerAccess.upsert({
      where: { customerId_employeeId: { customerId, employeeId: dto.employeeId } },
      create: { customerId, employeeId: dto.employeeId, accessType: dto.accessType },
      update: { accessType: dto.accessType },
    });
  }
}
