import { OpportunityStage, Role } from '@prisma/client';
import { prisma } from '../lib/prisma';

export interface AdminOverview {
  employeeCount: number;
  customerCount: number;
  openOpportunityCount: number;
  closedWonCount: number;
  opportunitiesByStage: { stage: OpportunityStage; count: number }[];
}

export interface ActivityNoteEdit {
  id: string;
  previousNotes: string | null;
  newNotes: string | null;
  editedAt: Date;
  editedBy: { id: string; username: string };
}

export interface ActivityEntry {
  id: string;
  opportunityId: string;
  opportunityName: string;
  customer: { id: string; firstName: string | null; lastName: string | null; company: string | null };
  fromStage: OpportunityStage | null;
  toStage: OpportunityStage;
  notes: string | null;
  changedAt: Date;
  changedBy: { id: string; username: string };
  noteEdits: ActivityNoteEdit[];
}

const OPEN_STAGES: OpportunityStage[] = [
  'LEAD',
  'QUALIFIED_LEAD',
  'NEEDS_ANALYSIS',
  'PROPOSAL_DEMO',
  'NEGOTIATION',
  'ONBOARDING',
  'ACTIVE_RETENTION',
];

export class AdminService {
  private static instance: AdminService;

  private constructor() {}

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getOverview(): Promise<AdminOverview> {
    const [employeeCount, customerCount, openOpportunityCount, closedWonCount, stageGroups] =
      await Promise.all([
        prisma.employee.count({ where: { role: { in: [Role.ADMIN, Role.EMPLOYEE] } } }),
        prisma.customer.count(),
        prisma.opportunity.count({ where: { stage: { in: OPEN_STAGES } } }),
        prisma.opportunity.count({ where: { stage: 'CLOSED_WON' } }),
        prisma.opportunity.groupBy({ by: ['stage'], _count: { _all: true } }),
      ]);

    const opportunitiesByStage = stageGroups.map((g) => ({
      stage: g.stage,
      count: g._count._all,
    }));

    return {
      employeeCount,
      customerCount,
      openOpportunityCount,
      closedWonCount,
      opportunitiesByStage,
    };
  }

  async getRecentActivity(limit: number): Promise<ActivityEntry[]> {
    const entries = await prisma.opportunityStageHistory.findMany({
      orderBy: { changedAt: 'desc' },
      take: limit,
      include: {
        changedBy: { select: { id: true, username: true } },
        opportunity: {
          select: {
            id: true,
            name: true,
            customer: { select: { id: true, firstName: true, lastName: true, company: true } },
          },
        },
        noteEdits: {
          orderBy: { editedAt: 'asc' },
          include: { editedBy: { select: { id: true, username: true } } },
        },
      },
    });

    return entries.map((e) => ({
      id: e.id,
      opportunityId: e.opportunity.id,
      opportunityName: e.opportunity.name,
      customer: e.opportunity.customer,
      fromStage: e.fromStage,
      toStage: e.toStage,
      notes: e.notes,
      changedAt: e.changedAt,
      changedBy: e.changedBy,
      noteEdits: e.noteEdits.map((ne) => ({
        id: ne.id,
        previousNotes: ne.previousNotes,
        newNotes: ne.newNotes,
        editedAt: ne.editedAt,
        editedBy: ne.editedBy,
      })),
    }));
  }

  async getEmployeeActivity(employeeId: string): Promise<ActivityEntry[]> {
    const entries = await prisma.opportunityStageHistory.findMany({
      where: { changedById: employeeId },
      orderBy: { changedAt: 'desc' },
      include: {
        changedBy: { select: { id: true, username: true } },
        opportunity: {
          select: {
            id: true,
            name: true,
            customer: { select: { id: true, firstName: true, lastName: true, company: true } },
          },
        },
        noteEdits: {
          orderBy: { editedAt: 'asc' },
          include: { editedBy: { select: { id: true, username: true } } },
        },
      },
    });

    return entries.map((e) => ({
      id: e.id,
      opportunityId: e.opportunity.id,
      opportunityName: e.opportunity.name,
      customer: e.opportunity.customer,
      fromStage: e.fromStage,
      toStage: e.toStage,
      notes: e.notes,
      changedAt: e.changedAt,
      changedBy: e.changedBy,
      noteEdits: e.noteEdits.map((ne) => ({
        id: ne.id,
        previousNotes: ne.previousNotes,
        newNotes: ne.newNotes,
        editedAt: ne.editedAt,
        editedBy: ne.editedBy,
      })),
    }));
  }
}
