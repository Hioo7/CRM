import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';
import { ConfirmModal } from '@/components/ConfirmModal';
import { ErrorBanner } from '@/components/ErrorBanner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { QuickMessageFilterBar } from '@/components/quick-messages/QuickMessageFilterBar';
import { QuickMessageGenerateModal } from '@/components/quick-messages/QuickMessageGenerateModal';
import { QuickMessagePreviewModal } from '@/components/quick-messages/QuickMessagePreviewModal';
import { QuickMessageTemplateCard } from '@/components/quick-messages/QuickMessageTemplateCard';
import { QuickMessageTemplateModal } from '@/components/quick-messages/QuickMessageTemplateModal';
import { useAuth } from '@/hooks/useAuth';
import { useCustomers } from '@/hooks/useCustomers';
import { useQuickMessages } from '@/hooks/useQuickMessages';
import { useModalState } from '@/hooks/useModalState';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { QUICK_MESSAGE_PLATFORM_LABELS } from '@/config/constants';
import { extractApiErrorMessage } from '@/utils/errors';
import type {
  QuickMessagePlatform,
  QuickMessageTemplate,
} from '@/types/quickMessage';

export function QuickMessagesPage() {
  const { employee } = useAuth();
  const { customers, isLoading: isCustomersLoading } = useCustomers();
  const {
    templates,
    metadata,
    lastRenderedMessage,
    isLoading,
    isMetadataLoading,
    isRendering,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    renderTemplate,
    clearRenderedMessage,
  } = useQuickMessages();
  const banner = useErrorBanner();
  const [searchParams, setSearchParams] = useSearchParams();
  const templateModal = useModalState();
  const generateModal = useModalState();
  const previewModal = useModalState();
  const deleteModal = useModalState();
  const [selectedPlatform, setSelectedPlatform] = useState<QuickMessagePlatform | 'ALL'>('ALL');
  const [editingTemplate, setEditingTemplate] = useState<QuickMessageTemplate | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<QuickMessageTemplate | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<QuickMessageTemplate | null>(null);

  const canManage = employee?.role === 'ADMIN' || employee?.role === 'SUPER_ADMIN';

  useEffect(() => {
    if (!canManage) {
      return;
    }

    if (searchParams.get('composer') === 'new') {
      templateModal.open();
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('composer');
        return next;
      }, { replace: true });
    }
  }, [canManage, searchParams, setSearchParams, templateModal]);

  useEffect(() => {
    if (lastRenderedMessage) {
      previewModal.open();
    }
  }, [lastRenderedMessage, previewModal]);

  const availablePlatforms = metadata?.platforms ?? [];
  const filteredTemplates = useMemo(
    () =>
      templates.filter((template) =>
        selectedPlatform === 'ALL' ? true : template.platform === selectedPlatform,
      ),
    [selectedPlatform, templates],
  );

  const groupedTemplates = useMemo(() => {
    return filteredTemplates.reduce<Record<string, QuickMessageTemplate[]>>((acc, template) => {
      const key = template.platform;
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(template);
      return acc;
    }, {});
  }, [filteredTemplates]);

  if (!employee) {
    return null;
  }

  const handleCreateTemplate = async (
    payload: { name: string; platform: QuickMessagePlatform; content: string },
  ): Promise<void> => {
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, payload);
      return;
    }

    await createTemplate(payload);
  };

  const handleGenerate = async (customerId: string): Promise<void> => {
    if (!activeTemplate) {
      return;
    }

    await renderTemplate({
      templateId: activeTemplate.id,
      customerId,
    });
    generateModal.close();
  };

  const handleDeleteTemplate = async (): Promise<void> => {
    if (!templateToDelete) {
      return;
    }

    try {
      await deleteTemplate(templateToDelete.id);
      deleteModal.close();
      setTemplateToDelete(null);
    } catch (err) {
      banner.showError(extractApiErrorMessage(err as Error));
    }
  };

  const hasLoadingState = isLoading || isMetadataLoading || isCustomersLoading;

  return (
    <div className="flex flex-col gap-6">
      <section className="dashboard-panel px-5 py-6 md:px-7 md:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="dashboard-kicker">Tools</p>
            <h2 className="dashboard-section-title mt-3">Quick Messages</h2>
            <p className="dashboard-section-copy mt-3">
              Generate fast, customer-ready messages from reusable templates. Keep the workflow to a few taps: choose a template, choose a customer, copy the result.
            </p>
          </div>

          {canManage ? (
            <button
              type="button"
              className="btn rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700"
              onClick={() => {
                setEditingTemplate(null);
                templateModal.open();
              }}
            >
              <HiOutlinePlus className="h-5 w-5" />
              New Template
            </button>
          ) : null}
        </div>

        <div className="mt-5">
          <QuickMessageFilterBar
            availablePlatforms={availablePlatforms}
            selectedPlatform={selectedPlatform}
            onSelect={setSelectedPlatform}
          />
        </div>
      </section>

      <ErrorBanner message={banner.error ?? error} />

      {hasLoadingState ? (
        <LoadingSpinner />
      ) : filteredTemplates.length === 0 ? (
        <section className="dashboard-card flex flex-col items-center justify-center px-6 py-14 text-center">
          <p className="dashboard-kicker">Templates</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">No quick messages yet</h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
            {canManage
              ? 'Create your first template to help the team move through leads faster.'
              : 'No quick message templates are available right now.'}
          </p>
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          {Object.entries(groupedTemplates).map(([platform, platformTemplates]) => (
            <section key={platform} className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="dashboard-kicker">{QUICK_MESSAGE_PLATFORM_LABELS[platform as QuickMessagePlatform]}</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">
                    {platformTemplates.length} template{platformTemplates.length === 1 ? '' : 's'}
                  </h3>
                </div>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {platformTemplates.map((template) => (
                  <QuickMessageTemplateCard
                    key={template.id}
                    template={template}
                    canManage={canManage}
                    onCreate={(entry) => {
                      setActiveTemplate(entry);
                      generateModal.open();
                    }}
                    onEdit={(entry) => {
                      setEditingTemplate(entry);
                      templateModal.open();
                    }}
                    onDelete={(entry) => {
                      setTemplateToDelete(entry);
                      deleteModal.open();
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <QuickMessageTemplateModal
        key={editingTemplate?.id ?? (templateModal.isOpen ? 'new' : 'closed')}
        isOpen={templateModal.isOpen}
        placeholders={metadata?.placeholders ?? []}
        template={editingTemplate}
        onClose={() => {
          setEditingTemplate(null);
          templateModal.close();
        }}
        onSubmit={handleCreateTemplate}
      />

      <QuickMessageGenerateModal
        isOpen={generateModal.isOpen}
        isGenerating={isRendering}
        customers={customers}
        template={activeTemplate}
        onClose={() => {
          setActiveTemplate(null);
          generateModal.close();
        }}
        onGenerate={handleGenerate}
      />

      <QuickMessagePreviewModal
        isOpen={previewModal.isOpen}
        preview={lastRenderedMessage}
        onClose={() => {
          clearRenderedMessage();
          previewModal.close();
        }}
      />

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete quick message template"
        description={`Delete "${templateToDelete?.name ?? 'this template'}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => void handleDeleteTemplate()}
        onClose={() => {
          setTemplateToDelete(null);
          deleteModal.close();
        }}
      />
    </div>
  );
}
