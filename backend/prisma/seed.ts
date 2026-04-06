import { Role } from '@prisma/client';
import { AppConfig } from '../src/config/AppConfig';
import { PasswordService } from '../src/lib/PasswordService';
import { prisma } from '../src/lib/prisma';

type SeedEmployee = {
  id: string;
  username: string;
  email: string;
  role: Role;
};

class SuperAdminSeedService {
  private readonly config: AppConfig;
  private readonly passwordService: PasswordService;

  constructor(config: AppConfig, passwordService: PasswordService) {
    this.config = config;
    this.passwordService = passwordService;
  }

  async seed(): Promise<SeedEmployee> {
    const matches = await prisma.employee.findMany({
      where: {
        OR: [
          { username: this.config.superAdminUsername },
          { email: this.config.superAdminEmail },
        ],
      },
    });

    const distinctMatches = Array.from(
      new Map(matches.map((employee) => [employee.id, employee])).values(),
    );

    if (distinctMatches.length > 1) {
      throw new Error(
        'Super admin seed credentials match multiple employee records. Resolve the conflicting username/email values before seeding.',
      );
    }

    const password = await this.passwordService.hash(this.config.superAdminPassword);

    if (distinctMatches.length === 0) {
      return prisma.employee.create({
        data: {
          username: this.config.superAdminUsername,
          email: this.config.superAdminEmail,
          password,
          role: Role.SUPER_ADMIN,
        },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
        },
      });
    }

    return prisma.employee.update({
      where: { id: distinctMatches[0].id },
      data: {
        username: this.config.superAdminUsername,
        email: this.config.superAdminEmail,
        password,
        role: Role.SUPER_ADMIN,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
    });
  }
}

async function main(): Promise<void> {
  const config = AppConfig.getInstance();
  const seedService = new SuperAdminSeedService(config, PasswordService.getInstance());
  const superAdmin = await seedService.seed();

  console.log(`Super admin ready: ${superAdmin.email} (${superAdmin.role})`);
}

main()
  .catch((error: Error) => {
    console.error('Prisma seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
