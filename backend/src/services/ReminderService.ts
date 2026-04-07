import { Prisma, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../lib/AppError';
import { CreateReminderDto, ListRemindersQueryDto } from '../schema/reminder.schema';

const reminderInclude = {
  opportunity: {
    select: {
      id: true,
      name: true,
      customer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          company: true,
          phone: true,
        },
      },
    },
  },
} as const;

type ReminderWithOpportunity = Prisma.ReminderGetPayload<{
  include: typeof reminderInclude;
}>;

export class ReminderService {
  private static instance: ReminderService;

  private constructor() {}

  static getInstance(): ReminderService {
    if (!ReminderService.instance) {
      ReminderService.instance = new ReminderService();
    }
    return ReminderService.instance;
  }

  async createReminder(
    employeeId: string,
    role: Role,
    dto: CreateReminderDto,
  ): Promise<ReminderWithOpportunity> {
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: dto.opportunityId },
    });

    if (!opportunity) {
      throw new AppError(404, 'Opportunity not found');
    }

    if (role === Role.EMPLOYEE) {
      const access = await prisma.opportunityAccess.findUnique({
        where: {
          opportunityId_employeeId: {
            opportunityId: dto.opportunityId,
            employeeId,
          },
        },
      });

      if (!access) {
        throw new AppError(403, 'You do not have access to this opportunity');
      }
    }

    return prisma.reminder.create({
      data: {
        opportunityId: dto.opportunityId,
        description: dto.description,
        eventAt: new Date(dto.eventAt),
        notifyBefore: dto.notifyBefore,
        employeeId,
      },
      include: reminderInclude,
    });
  }

  async listReminders(
    employeeId: string,
    dto: ListRemindersQueryDto,
  ): Promise<ReminderWithOpportunity[]> {
    const completedFilter = dto.completed === 'true' ? true : false;

    return prisma.reminder.findMany({
      where: {
        employeeId,
        completed: completedFilter,
        ...(dto.opportunityId ? { opportunityId: dto.opportunityId } : {}),
      },
      orderBy: { eventAt: 'asc' },
      include: reminderInclude,
    });
  }

  async markComplete(reminderId: string): Promise<ReminderWithOpportunity> {
    return prisma.reminder.update({
      where: { id: reminderId },
      data: { completed: true, completedAt: new Date() },
      include: reminderInclude,
    });
  }

  async findById(reminderId: string): Promise<ReminderWithOpportunity> {
    const reminder = await prisma.reminder.findUnique({
      where: { id: reminderId },
      include: reminderInclude,
    });

    if (!reminder) {
      throw new AppError(404, 'Reminder not found');
    }

    return reminder;
  }
}
