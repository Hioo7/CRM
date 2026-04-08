import { Prisma, Role, SocialPlatform } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';
import {
  QUICK_MESSAGE_PLACEHOLDER_PATTERN,
  QUICK_MESSAGE_TEMPLATE_FIELDS,
} from '../config/constants';
import type {
  CreateQuickMessageTemplateDto,
  RenderQuickMessageTemplateDto,
  UpdateQuickMessageTemplateDto,
} from '../schema/quick-message-template.schema';

const quickMessageTemplateInclude = {
  createdBy: {
    select: {
      id: true,
      username: true,
      role: true,
    },
  },
} as const;

type QuickMessageTemplateRecord = Prisma.QuickMessageTemplateGetPayload<{
  include: typeof quickMessageTemplateInclude;
}>;

interface QuickMessageTemplateMetadata {
  platforms: SocialPlatform[];
  placeholders: Array<{
    field: (typeof QUICK_MESSAGE_TEMPLATE_FIELDS)[number];
    token: `#${(typeof QUICK_MESSAGE_TEMPLATE_FIELDS)[number]}`;
  }>;
}

interface RenderedQuickMessageTemplate {
  templateId: string;
  customerId: string;
  platform: SocialPlatform;
  content: string;
  renderedContent: string;
  unresolvedPlaceholders: string[];
}

type QuickMessageTemplateField = (typeof QUICK_MESSAGE_TEMPLATE_FIELDS)[number];

type RenderableCustomer = {
  [K in QuickMessageTemplateField]: string | null;
};

function replacePlaceholders(
  content: string,
  customer: RenderableCustomer,
): { renderedContent: string; unresolvedPlaceholders: string[] } {
  const unresolvedPlaceholders = new Set<string>();

  const renderedContent = content.replace(QUICK_MESSAGE_PLACEHOLDER_PATTERN, (match) => {
    const field = match.slice(1) as QuickMessageTemplateField;
    const value = customer[field];

    if (!value) {
      unresolvedPlaceholders.add(match);
      return match;
    }

    return value;
  });

  return {
    renderedContent,
    unresolvedPlaceholders: [...unresolvedPlaceholders],
  };
}

export class QuickMessageTemplateService {
  private static instance: QuickMessageTemplateService;

  private constructor() {}

  static getInstance(): QuickMessageTemplateService {
    if (!QuickMessageTemplateService.instance) {
      QuickMessageTemplateService.instance = new QuickMessageTemplateService();
    }

    return QuickMessageTemplateService.instance;
  }

  async create(
    createdById: string,
    dto: CreateQuickMessageTemplateDto,
  ): Promise<QuickMessageTemplateRecord> {
    return prisma.quickMessageTemplate.create({
      data: {
        ...dto,
        createdById,
      },
      include: quickMessageTemplateInclude,
    });
  }

  async findAll(platform?: SocialPlatform): Promise<QuickMessageTemplateRecord[]> {
    return prisma.quickMessageTemplate.findMany({
      where: platform ? { platform } : undefined,
      include: quickMessageTemplateInclude,
      orderBy: [{ updatedAt: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findById(id: string): Promise<QuickMessageTemplateRecord> {
    const template = await prisma.quickMessageTemplate.findUnique({
      where: { id },
      include: quickMessageTemplateInclude,
    });

    if (!template) {
      throw new AppError(404, 'Quick message template not found');
    }

    return template;
  }

  async update(
    id: string,
    dto: UpdateQuickMessageTemplateDto,
  ): Promise<QuickMessageTemplateRecord> {
    const existing = await prisma.quickMessageTemplate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Quick message template not found');
    }

    return prisma.quickMessageTemplate.update({
      where: { id },
      data: dto,
      include: quickMessageTemplateInclude,
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.quickMessageTemplate.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Quick message template not found');
    }

    await prisma.quickMessageTemplate.delete({ where: { id } });
  }

  getMetadata(): QuickMessageTemplateMetadata {
    return {
      platforms: Object.values(SocialPlatform),
      placeholders: QUICK_MESSAGE_TEMPLATE_FIELDS.map((field) => ({
        field,
        token: `#${field}`,
      })),
    };
  }

  async render(
    employeeId: string,
    role: Role,
    dto: RenderQuickMessageTemplateDto,
  ): Promise<RenderedQuickMessageTemplate> {
    const template = await prisma.quickMessageTemplate.findUnique({
      where: { id: dto.templateId },
    });

    if (!template) {
      throw new AppError(404, 'Quick message template not found');
    }

    const customer = await prisma.customer.findUnique({
      where: { id: dto.customerId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        instagramHandle: true,
        linkedinProfileUrl: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
        company: true,
        notes: true,
      },
    });

    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }

    if (role === Role.EMPLOYEE) {
      const access = await prisma.customerAccess.findUnique({
        where: {
          customerId_employeeId: {
            customerId: dto.customerId,
            employeeId,
          },
        },
      });

      if (!access) {
        throw new AppError(403, 'You do not have access to this customer');
      }
    }

    const { renderedContent, unresolvedPlaceholders } = replacePlaceholders(
      template.content,
      customer,
    );

    return {
      templateId: template.id,
      customerId: customer.id,
      platform: template.platform,
      content: template.content,
      renderedContent,
      unresolvedPlaceholders,
    };
  }
}
