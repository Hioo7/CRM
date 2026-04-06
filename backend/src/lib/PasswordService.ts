import bcrypt from 'bcryptjs';
import { AppConfig } from '../config/AppConfig';

export class PasswordService {
  private static instance: PasswordService;

  private constructor() {}

  static getInstance(): PasswordService {
    if (!PasswordService.instance) {
      PasswordService.instance = new PasswordService();
    }
    return PasswordService.instance;
  }

  async hash(plain: string): Promise<string> {
    const rounds = AppConfig.getInstance().bcryptSaltRounds;
    return bcrypt.hash(plain, rounds);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }
}
