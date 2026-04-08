import httpClient from './httpClient';
import type {
  CreateQuickMessageTemplatePayload,
  QuickMessageMetadata,
  QuickMessagePlatform,
  QuickMessageTemplate,
  RenderQuickMessagePayload,
  RenderQuickMessageResponse,
  UpdateQuickMessageTemplatePayload,
} from '@/types/quickMessage';

export const quickMessageService = {
  async list(platform?: QuickMessagePlatform): Promise<QuickMessageTemplate[]> {
    const { data } = await httpClient.get<QuickMessageTemplate[]>('/quick-message-templates', {
      params: platform ? { platform } : undefined,
    });
    return data;
  },

  async getById(id: string): Promise<QuickMessageTemplate> {
    const { data } = await httpClient.get<QuickMessageTemplate>(`/quick-message-templates/${id}`);
    return data;
  },

  async getMetadata(): Promise<QuickMessageMetadata> {
    const { data } = await httpClient.get<QuickMessageMetadata>('/quick-message-templates/meta');
    return data;
  },

  async create(payload: CreateQuickMessageTemplatePayload): Promise<QuickMessageTemplate> {
    const { data } = await httpClient.post<QuickMessageTemplate>('/quick-message-templates', payload);
    return data;
  },

  async update(id: string, payload: UpdateQuickMessageTemplatePayload): Promise<QuickMessageTemplate> {
    const { data } = await httpClient.patch<QuickMessageTemplate>(`/quick-message-templates/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/quick-message-templates/${id}`);
  },

  async render(payload: RenderQuickMessagePayload): Promise<RenderQuickMessageResponse> {
    const { data } = await httpClient.post<RenderQuickMessageResponse>('/quick-message-templates/render', payload);
    return data;
  },
};
