import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { QuickMessageContext } from '@/contexts/QuickMessageContext';
import { quickMessageService } from '@/services/quickMessageService';
import { extractApiErrorMessage } from '@/utils/errors';
import type {
  CreateQuickMessageTemplatePayload,
  QuickMessageMetadata,
  QuickMessagePlatform,
  QuickMessageTemplate,
  RenderQuickMessagePayload,
  RenderQuickMessageResponse,
  UpdateQuickMessageTemplatePayload,
} from '@/types/quickMessage';

interface QuickMessageProviderProps {
  children: ReactNode;
}

function upsertTemplate(
  templates: QuickMessageTemplate[],
  template: QuickMessageTemplate,
): QuickMessageTemplate[] {
  const existingIndex = templates.findIndex((entry) => entry.id === template.id);
  if (existingIndex < 0) {
    return [template, ...templates];
  }

  const next = [...templates];
  next[existingIndex] = template;
  return next;
}

export function QuickMessageProvider({ children }: QuickMessageProviderProps) {
  const [templates, setTemplates] = useState<QuickMessageTemplate[]>([]);
  const [metadata, setMetadata] = useState<QuickMessageMetadata | null>(null);
  const [lastRenderedMessage, setLastRenderedMessage] = useState<RenderQuickMessageResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMetadataLoading, setIsMetadataLoading] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async (platform?: QuickMessagePlatform): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await quickMessageService.list(platform);
      setTemplates(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMetadata = useCallback(async (): Promise<void> => {
    setIsMetadataLoading(true);
    try {
      const data = await quickMessageService.getMetadata();
      setMetadata(data);
    } catch (err) {
      setError(extractApiErrorMessage(err as Error));
    } finally {
      setIsMetadataLoading(false);
    }
  }, []);

  const createTemplate = useCallback(async (
    payload: CreateQuickMessageTemplatePayload,
  ): Promise<QuickMessageTemplate> => {
    const created = await quickMessageService.create(payload);
    setTemplates((prev) => upsertTemplate(prev, created));
    return created;
  }, []);

  const updateTemplate = useCallback(async (
    id: string,
    payload: UpdateQuickMessageTemplatePayload,
  ): Promise<QuickMessageTemplate> => {
    const updated = await quickMessageService.update(id, payload);
    setTemplates((prev) => upsertTemplate(prev, updated));
    return updated;
  }, []);

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    await quickMessageService.delete(id);
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  }, []);

  const renderTemplate = useCallback(async (
    payload: RenderQuickMessagePayload,
  ): Promise<RenderQuickMessageResponse> => {
    setIsRendering(true);
    setError(null);
    try {
      const rendered = await quickMessageService.render(payload);
      setLastRenderedMessage(rendered);
      return rendered;
    } catch (err) {
      const message = extractApiErrorMessage(err as Error);
      setError(message);
      throw err;
    } finally {
      setIsRendering(false);
    }
  }, []);

  const clearRenderedMessage = useCallback((): void => {
    setLastRenderedMessage(null);
  }, []);

  useEffect(() => {
    void fetchTemplates();
    void fetchMetadata();
  }, [fetchMetadata, fetchTemplates]);

  return (
    <QuickMessageContext.Provider
      value={{
        templates,
        metadata,
        lastRenderedMessage,
        isLoading,
        isMetadataLoading,
        isRendering,
        error,
        fetchTemplates,
        fetchMetadata,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        renderTemplate,
        clearRenderedMessage,
      }}
    >
      {children}
    </QuickMessageContext.Provider>
  );
}
