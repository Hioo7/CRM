import { createContext } from 'react';
import type {
  CreateQuickMessageTemplatePayload,
  QuickMessageMetadata,
  QuickMessagePlatform,
  QuickMessageTemplate,
  RenderQuickMessagePayload,
  RenderQuickMessageResponse,
  UpdateQuickMessageTemplatePayload,
} from '@/types/quickMessage';

export interface QuickMessageContextValue {
  templates: QuickMessageTemplate[];
  metadata: QuickMessageMetadata | null;
  lastRenderedMessage: RenderQuickMessageResponse | null;
  isLoading: boolean;
  isMetadataLoading: boolean;
  isRendering: boolean;
  error: string | null;
  fetchTemplates: (platform?: QuickMessagePlatform) => Promise<void>;
  fetchMetadata: () => Promise<void>;
  createTemplate: (payload: CreateQuickMessageTemplatePayload) => Promise<QuickMessageTemplate>;
  updateTemplate: (id: string, payload: UpdateQuickMessageTemplatePayload) => Promise<QuickMessageTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  renderTemplate: (payload: RenderQuickMessagePayload) => Promise<RenderQuickMessageResponse>;
  clearRenderedMessage: () => void;
}

export const QuickMessageContext = createContext<QuickMessageContextValue | null>(null);
