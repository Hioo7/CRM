import { prisma } from '../lib/prisma';
import { JwtService } from '../lib/JwtService';
import { PasswordService } from '../lib/PasswordService';
import { AppError } from '../lib/AppError';
import { LoginDto } from '../schema/auth.schema';

export interface LoginResult {
  token: string;
  employee: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(dto: LoginDto): Promise<LoginResult> {
    const employee = await prisma.employee.findUnique({
      where: { email: dto.email },
    });

    if (!employee) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isMatch = await PasswordService.getInstance().compare(dto.password, employee.password);
    if (!isMatch) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = JwtService.getInstance().sign({
      sub: employee.id,
      username: employee.username,
      role: employee.role,
    });

    return {
      token,
      employee: {
        id: employee.id,
        username: employee.username,
        email: employee.email,
        role: employee.role,
      },
    };
  }
}
