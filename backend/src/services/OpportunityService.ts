import { AccessType, Prisma, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../schema/opportunity.schema';
import { StageChangeDto } from '../schema/opportunity-stage.schema';
import { NoteEditDto } from '../schema/opportunity-note.schema';
import { GrantOpportunityAccessDto } from '../schema/opportunity-access.schema';

const opportunityListInclude = {
  customer: { select: { id: true, firstName: true, lastName: true, company: true } },
  createdBy: { select: { id: true, username: true } },
  accesses: { select: { employeeId: true, accessType: true } },
} as const;

const opportunityDetailInclude = {
  customer: { select: { id: true, firstName: true, lastName: true, company: true } },
  createdBy: { select: { id: true, username: true } },
  accesses: {
    select: {
      id: true,
      employeeId: true,
      accessType: true,
      employee: { select: { id: true, username: true, email: true } },
    },
  },
  stageHistory: {
    orderBy: { changedAt: 'asc' as const },
    include: {
      changedBy: { select: { id: true, username: true } },
      noteEdits: {
        orderBy: { editedAt: 'asc' as const },
        include: { editedBy: { select: { id: true, username: true } } },
      },
    },
  },
} as const;

type OpportunityListItem = Prisma.OpportunityGetPayload<{
  include: typeof opportunityListInclude;
}>;
type OpportunityDetail = Prisma.OpportunityGetPayload<{
  include: typeof opportunityDetailInclude;
}>;
type OpportunityAccessWithEmployee = Prisma.OpportunityAccessGetPayload<{
  include: { employee: { select: { id: true; username: true; email: true } } };
}>;

export class OpportunityService {
  private static instance: OpportunityService;

  private constructor() {}

  static getInstance(): OpportunityService {
    if (!OpportunityService.instance) {
      OpportunityService.instance = new OpportunityService();
    }
    return OpportunityService.instance;
  }

  async create(
    createdById: string,
    role: Role,
    dto: CreateOpportunityDto,
  ): Promise<OpportunityListItem> {
    const customer = await prisma.customer.findUnique({ where: { id: dto.customerId } });
    if (!customer) {
      throw new AppError(404, 'Customer not found');
    }

    if (role === Role.EMPLOYEE) {
      const customerAccess = await prisma.customerAccess.findUnique({
        where: { customerId_employeeId: { customerId: dto.customerId, employeeId: createdById } },
      });
      if (!customerAccess) {
        throw new AppError(403, 'You do not have access to this customer');
      }
    }

    return prisma.$transaction(async (tx) => {
      const opportunity = await tx.opportunity.create({
        data: { name: dto.name, customerId: dto.customerId, createdById },
      });

      await tx.opportunityStageHistory.create({
        data: {
          opportunityId: opportunity.id,
          fromStage: null,
          toStage: 'LEAD',
          changedById: createdById,
        },
      });

      await tx.opportunityAccess.create({
        data: {
          opportunityId: opportunity.id,
          employeeId: createdById,
          accessType: AccessType.READ_WRITE,
        },
      });

      return tx.opportunity.findUniqueOrThrow({
        where: { id: opportunity.id },
        include: opportunityListInclude,
      });
    });
  }

  async findAll(
    employeeId: string,
    role: Role,
    customerId?: string,
    createdById?: string,
  ): Promise<OpportunityListItem[]> {
    const baseFilter = {
      ...(customerId ? { customerId } : {}),
      ...(createdById ? { createdById } : {}),
    };

    if (role === Role.ADMIN || role === Role.SUPER_ADMIN) {
      return prisma.opportunity.findMany({
        where: Object.keys(baseFilter).length > 0 ? baseFilter : undefined,
        orderBy: { createdAt: 'desc' },
        include: opportunityListInclude,
      });
    }

    return prisma.opportunity.findMany({
      where: { ...baseFilter, accesses: { some: { employeeId } } },
      orderBy: { createdAt: 'desc' },
      include: opportunityListInclude,
    });
  }

  async findById(id: string): Promise<OpportunityDetail> {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: opportunityDetailInclude,
    });
    if (!opportunity) {
      throw new AppError(404, 'Opportunity not found');
    }
    return opportunity;
  }

  async update(id: string, dto: UpdateOpportunityDto): Promise<OpportunityDetail> {
    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Opportunity not found');
    }

    return prisma.opportunity.update({
      where: { id },
      data: { name: dto.name },
      include: opportunityDetailInclude,
    });
  }

  async delete(id: string): Promise<void> {
    const existing = await prisma.opportunity.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError(404, 'Opportunity not found');
    }
    await prisma.opportunity.delete({ where: { id } });
  }

  async changeStage(
    opportunityId: string,
    changedById: string,
    dto: StageChangeDto,
  ): Promise<OpportunityDetail> {
    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) {
      throw new AppError(404, 'Opportunity not found');
    }

    return prisma.$transaction(async (tx) => {
      await tx.opportunityStageHistory.create({
        data: {
          opportunityId,
          fromStage: opportunity.stage,
          toStage: dto.toStage,
          notes: dto.notes ?? null,
          changedById,
        },
      });

      await tx.opportunity.update({
        where: { id: opportunityId },
        data: { stage: dto.toStage },
      });

      return tx.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        include: opportunityDetailInclude,
      });
    });
  }

  async editNotes(
    opportunityId: string,
    historyId: string,
    editedById: string,
    dto: NoteEditDto,
  ): Promise<OpportunityDetail> {
    const history = await prisma.opportunityStageHistory.findUnique({ where: { id: historyId } });
    if (!history || history.opportunityId !== opportunityId) {
      throw new AppError(404, 'Stage history record not found');
    }

    return prisma.$transaction(async (tx) => {
      await tx.opportunityNoteEdit.create({
        data: {
          stageHistoryId: historyId,
          previousNotes: history.notes,
          newNotes: dto.notes,
          editedById,
        },
      });

      await tx.opportunityStageHistory.update({
        where: { id: historyId },
        data: { notes: dto.notes },
      });

      return tx.opportunity.findUniqueOrThrow({
        where: { id: opportunityId },
        include: opportunityDetailInclude,
      });
    });
  }

  async grantAccess(
    opportunityId: string,
    dto: GrantOpportunityAccessDto,
  ): Promise<OpportunityAccessWithEmployee> {
    const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) {
      throw new AppError(404, 'Opportunity not found');
    }

    const employee = await prisma.employee.findUnique({ where: { id: dto.employeeId } });
    if (!employee) {
      throw new AppError(404, 'Employee not found');
    }

    return prisma.opportunityAccess.upsert({
      where: { opportunityId_employeeId: { opportunityId, employeeId: dto.employeeId } },
      create: { opportunityId, employeeId: dto.employeeId, accessType: dto.accessType },
      update: { accessType: dto.accessType },
      include: { employee: { select: { id: true, username: true, email: true } } },
    });
  }

  async revokeAccess(opportunityId: string, employeeId: string): Promise<void> {
    const access = await prisma.opportunityAccess.findUnique({
      where: { opportunityId_employeeId: { opportunityId, employeeId } },
    });
    if (!access) {
      throw new AppError(404, 'Access record not found');
    }
    await prisma.opportunityAccess.delete({
      where: { opportunityId_employeeId: { opportunityId, employeeId } },
    });
  }
}
