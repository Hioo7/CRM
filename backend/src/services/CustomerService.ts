import { AccessType, Prisma, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';
import { CreateCustomerDto, UpdateCustomerDto } from '../schema/customer.schema';
import { GrantCustomerAccessDto } from '../schema/customer-access.schema';

const customerListInclude = {
  createdBy: { select: { id: true, username: true } },
  customerAccesses: { select: { employeeId: true, accessType: true } },
} as const;

const customerDetailInclude = {
  createdBy: { select: { id: true, username: true } },
  customerAccesses: {
    select: {
      id: true,
      employeeId: true,
      accessType: true,
      employee: { select: { id: true, username: true, email: true } },
    },
  },
} as const;

type CustomerListItem = Prisma.CustomerGetPayload<{ include: typeof customerListInclude }>;
type CustomerDetail = Prisma.CustomerGetPayload<{ include: typeof customerDetailInclude }>;
type CustomerAccessWithEmployee = Prisma.CustomerAccessGetPayload<{
  include: { employee: { select: { id: true; username: true; email: true } } };
}>;

export class CustomerService {
  private static instance: CustomerService;

  private constructor() {}

  static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  async create(createdById: string, dto: CreateCustomerDto): Promise<CustomerListItem> {
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

      return tx.customer.findUniqueOrThrow({
        where: { id: customer.id },
        include: customerListInclude,
      });
    });
  }

  async findAll(
    employeeId: string,
    role: Role,
    createdById?: string,
  ): Promise<CustomerListItem[]> {
    if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
      return prisma.customer.findMany({
        where: createdById ? { createdById } : undefined,
        orderBy: { createdAt: 'desc' },
        include: customerListInclude,
      });
    }

    return prisma.customer.findMany({
      where: { customerAccesses: { some: { employeeId } } },
      orderBy: { createdAt: 'desc' },
      include: customerListInclude,
    });
  }

  async findById(id: string): Promise<CustomerDetail> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: customerDetailInclude,
    });
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<CustomerDetail> {
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
      include: customerDetailInclude,
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
  ): Promise<CustomerAccessWithEmployee> {
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
      include: { employee: { select: { id: true, username: true, email: true } } },
    });
  }

  async revokeAccess(customerId: string, employeeId: string): Promise<void> {
    const access = await prisma.customerAccess.findUnique({
      where: { customerId_employeeId: { customerId, employeeId } },
    });
    if (!access) {
      throw new AppError(404, 'Access record not found');
    }

    await prisma.customerAccess.delete({
      where: { customerId_employeeId: { customerId, employeeId } },
    });
  }
}
