import { Employee, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { PasswordService } from '../lib/PasswordService';
import { AppError } from '../lib/AppError';
import { ROLE_HIERARCHY } from '../config/constants';
import { CreateEmployeeDto, UpdateEmployeeDto, UpdateSelfDto } from '../schema/employee.schema';

type SafeEmployee = Omit<Employee, 'password'>;

function canManage(actorRole: Role, targetRole: Role): boolean {
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
}

function stripPassword(employee: Employee): SafeEmployee {
  const { password: _, ...safe } = employee;
  return safe;
}

export class EmployeeService {
  private static instance: EmployeeService;

  private constructor() {}

  static getInstance(): EmployeeService {
    if (!EmployeeService.instance) {
      EmployeeService.instance = new EmployeeService();
    }
    return EmployeeService.instance;
  }

  async create(dto: CreateEmployeeDto): Promise<SafeEmployee> {
    const existing = await prisma.employee.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
    });

    if (existing) {
      const field = existing.username === dto.username ? 'Username' : 'Email';
      throw new AppError(409, `${field} is already taken`);
    }

    const hashed = await PasswordService.getInstance().hash(dto.password);

    const employee = await prisma.employee.create({
      data: { ...dto, password: hashed },
    });

    return stripPassword(employee);
  }

  async findAll(): Promise<SafeEmployee[]> {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return employees.map(stripPassword);
  }

  async findById(id: string): Promise<SafeEmployee> {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) {
      throw new AppError(404, 'Employee not found');
    }
    return stripPassword(employee);
  }

  async update(
    actorRole: Role,
    targetId: string,
    dto: UpdateEmployeeDto,
  ): Promise<SafeEmployee> {
    const target = await prisma.employee.findUnique({ where: { id: targetId } });
    if (!target) {
      throw new AppError(404, 'Employee not found');
    }

    if (!canManage(actorRole, target.role)) {
      throw new AppError(403, 'Insufficient privileges to modify this account');
    }

    if (dto.role && !canManage(actorRole, dto.role)) {
      throw new AppError(403, 'Cannot assign a role equal to or higher than your own');
    }

    const data: Partial<typeof dto & { password: string }> = { ...dto };
    if (dto.password) {
      data.password = await PasswordService.getInstance().hash(dto.password);
    }

    const updated = await prisma.employee.update({
      where: { id: targetId },
      data,
    });

    return stripPassword(updated);
  }

  async remove(actorId: string, actorRole: Role, targetId: string): Promise<void> {
    if (actorId === targetId) {
      throw new AppError(400, 'You cannot delete your own account');
    }

    const target = await prisma.employee.findUnique({ where: { id: targetId } });
    if (!target) {
      throw new AppError(404, 'Employee not found');
    }

    if (!canManage(actorRole, target.role)) {
      throw new AppError(403, 'Insufficient privileges to delete this account');
    }

    await prisma.employee.delete({ where: { id: targetId } });
  }

  async updateSelf(id: string, dto: UpdateSelfDto): Promise<SafeEmployee> {
    const data: Partial<{ email: string; password: string }> = {};

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.password) {
      data.password = await PasswordService.getInstance().hash(dto.password);
    }

    const updated = await prisma.employee.update({
      where: { id },
      data,
    });

    return stripPassword(updated);
  }
}
