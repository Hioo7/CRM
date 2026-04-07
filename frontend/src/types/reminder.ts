export interface ReminderOpportunitySummary {
  id: string;
  name: string;
  customer: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    company: string | null;
    phone: string | null;
  };
}

export interface ReminderListItem {
  id: string;
  description: string;
  eventAt: string;
  notifyBefore: number;
  completed: boolean;
  completedAt: string | null;
  opportunityId: string;
  opportunity: ReminderOpportunitySummary;
  createdAt: string;
}

export interface CreateReminderPayload {
  opportunityId: string;
  description: string;
  eventAt: string;
  notifyBefore: number;
}
