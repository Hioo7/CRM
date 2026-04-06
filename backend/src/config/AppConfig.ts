import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().default(10),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .transform((value) =>
      value
        .split(',')
        .map((origin) => origin.trim())
        .filter((origin) => origin.length > 0),
    ),
  SUPER_ADMIN_USERNAME: z.string().min(3),
  SUPER_ADMIN_EMAIL: z.string().email(),
  SUPER_ADMIN_PASSWORD: z.string().min(8),
});

type Env = z.infer<typeof EnvSchema>;

export class AppConfig {
  private static instance: AppConfig;
  private readonly env: Env;

  private constructor() {
    const result = EnvSchema.safeParse(process.env);
    if (!result.success) {
      throw new Error(`Invalid environment configuration:\n${result.error.message}`);
    }
    this.env = result.data;
  }

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  get port(): number {
    return this.env.PORT;
  }

  get databaseUrl(): string {
    return this.env.DATABASE_URL;
  }

  get jwtSecret(): string {
    return this.env.JWT_SECRET;
  }

  get jwtExpiresIn(): string {
    return this.env.JWT_EXPIRES_IN;
  }

  get bcryptSaltRounds(): number {
    return this.env.BCRYPT_SALT_ROUNDS;
  }

  get corsAllowedOrigins(): string[] {
    return this.env.CORS_ALLOWED_ORIGINS;
  }

  get nodeEnv(): string {
    return this.env.NODE_ENV;
  }

  get superAdminUsername(): string {
    return this.env.SUPER_ADMIN_USERNAME;
  }

  get superAdminEmail(): string {
    return this.env.SUPER_ADMIN_EMAIL;
  }

  get superAdminPassword(): string {
    return this.env.SUPER_ADMIN_PASSWORD;
  }
}
