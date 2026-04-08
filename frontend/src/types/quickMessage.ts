import type { Role } from '@/types/auth';
import type { QUICK_MESSAGE_PLATFORMS } from '@/config/constants';

export type QuickMessagePlatform = (typeof QUICK_MESSAGE_PLATFORMS)[number];

export interface QuickMessageTemplateCreatedBy {
  id: string;
  username: string;
  role: Role;
}

export interface QuickMessageTemplate {
  id: string;
  name: string;
  platform: QuickMessagePlatform;
  content: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy: QuickMessageTemplateCreatedBy;
}

export interface QuickMessagePlaceholderMeta {
  field: string;
  token: string;
}

export interface QuickMessageMetadata {
  platforms: QuickMessagePlatform[];
  placeholders: QuickMessagePlaceholderMeta[];
}

export interface CreateQuickMessageTemplatePayload {
  name: string;
  platform: QuickMessagePlatform;
  content: string;
}

export interface UpdateQuickMessageTemplatePayload {
  name?: string;
  platform?: QuickMessagePlatform;
  content?: string;
}

export interface RenderQuickMessagePayload {
  templateId: string;
  customerId: string;
}

export interface RenderQuickMessageResponse {
  templateId: string;
  customerId: string;
  platform: QuickMessagePlatform;
  content: string;
  renderedContent: string;
  unresolvedPlaceholders: string[];
}
