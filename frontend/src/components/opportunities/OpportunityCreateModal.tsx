import { useMemo, useState } from 'react';
import { HiOutlineArrowLeft, HiOutlineBriefcase, HiOutlinePlus } from 'react-icons/hi2';
import { CreateCustomerModal } from '@/components/customers/CreateCustomerModal';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useCustomers } from '@/hooks/useCustomers';
import { useErrorBanner } from '@/hooks/useErrorBanner';
import { extractApiErrorMessage } from '@/utils/errors';
import { validateCreateOpportunityForm } from '@/utils/validators';
import { OPPORTUNITY_STAGES, OPPORTUNITY_STAGE_LABELS } from '@/config/constants';
import type { CustomerListItem, CreateCustomerPayload } from '@/types/customer';
import type { CreateOpportunityPayload, OpportunityStage } from '@/types/opportunity';

interface OpportunityCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateOpportunityPayload) => Promise<void>;
}

type OpportunityCreateStep = 'customer' | 'details';

interface OpportunityCreateFormState {
  customerId: string;
  name: string;
  stage: OpportunityStage;
}

const EMPTY_FORM: OpportunityCreateFormState = {
  customerId: '',
  name: '',
  stage: 'LEAD',
};

function getCustomerLabel(customer: CustomerListItem): string {
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  if (customer.company && fullName) {
    return `${fullName} - ${customer.company}`;
  }
  if (customer.company) {
    return customer.company;
  }
  return fullName || 'Unnamed customer';
}

export function OpportunityCreateModal({
  isOpen,
  onClose,
  onSubmit,
}: OpportunityCreateModalProps) {
  const banner = useErrorBanner();
  const { customers, createCustomer } = useCustomers();
  const [step, setStep] = useState<OpportunityCreateStep>('customer');
  const [form, setForm] = useState<OpportunityCreateFormState>(EMPTY_FORM);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const sortedCustomers = useMemo(
    () =>
      [...customers].sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [customers],
  );

  const filteredCustomers = useMemo(() => {
    const query = customerSearch.trim().toLowerCase();
    if (!query) {
      return sortedCustomers;
    }

    return sortedCustomers.filter((customer) => {
      const label = getCustomerLabel(customer).toLowerCase();
      const email = customer.email?.toLowerCase() ?? '';
      return label.includes(query) || email.includes(query);
    });
  }, [customerSearch, sortedCustomers]);

  const selectedCustomer = customers.find((customer) => customer.id === form.customerId) ?? null;

  if (!isOpen) {
    return null;
  }

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    banner.clearError();
    setStep('customer');
    setForm(EMPTY_FORM);
    setCustomerSearch('');
    setIsCustomerModalOpen(false);
    onClose();
  };

  const handleNext = (): void => {
    if (!form.customerId) {
      banner.showError('Please select a customer first.');
      return;
    }

    banner.clearError();
    setStep('details');
  };

  const handleCustomerCreate = async (payload: CreateCustomerPayload): Promise<void> => {
    const created = await createCustomer(payload);
    setForm((prev) => ({ ...prev, customerId: created.id }));
    setCustomerSearch('');
    setIsCustomerModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const payload: CreateOpportunityPayload = {
      customerId: form.customerId,
      name: form.name.trim(),
      stage: form.stage,
    };

    const error = validateCreateOpportunityForm(payload);
    if (error) {
      banner.showError(error);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
      handleClose();
    } catch (submitError) {
      banner.showError(extractApiErrorMessage(submitError as Error));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <dialog className="modal modal-open">
        <div className="modal-box max-h-[calc(100vh-2rem)] max-w-3xl overflow-y-auto rounded-[2rem] border border-white/80 bg-base-100/95 p-0 shadow-[0_24px_80px_rgba(95,78,59,0.2)]">
          <div className="flex items-start gap-4 border-b border-emerald-100 bg-emerald-50/80 px-6 py-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <HiOutlineBriefcase className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="dashboard-kicker">Opportunities</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Create Opportunity</h3>
                </div>
                <div className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                  Step {step === 'customer' ? '1' : '2'} of 2
                </div>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {step === 'customer'
                  ? 'Pick the customer first. You can create a new customer without leaving this flow.'
                  : 'Set the opportunity name and current stage. Keep it quick and move on.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6">
            <ErrorBanner message={banner.error} />

            {step === 'customer' ? (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <label className="form-control flex-1">
                    <span className="mb-2 text-sm font-semibold text-slate-700">Search customers</span>
                    <input
                      type="text"
                      className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                      value={customerSearch}
                      onChange={(event) => setCustomerSearch(event.target.value)}
                      placeholder="Search by name, company, or email"
                    />
                  </label>
                  <div className="sm:self-end">
                    <button
                      type="button"
                      className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 sm:w-auto"
                      onClick={() => setIsCustomerModalOpen(true)}
                    >
                      <HiOutlinePlus className="h-5 w-5" />
                      Create Customer
                    </button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {filteredCustomers.length === 0 ? (
                    <div className="rounded-[1.5rem] border border-dashed border-stone-300 px-5 py-10 text-center">
                      <p className="text-sm text-slate-500">
                        No matching customers. Create one and it will appear at the top automatically.
                      </p>
                    </div>
                  ) : (
                    filteredCustomers.map((customer) => {
                      const isSelected = form.customerId === customer.id;

                      return (
                        <button
                          key={customer.id}
                          type="button"
                          className={[
                            'rounded-[1.5rem] border px-4 py-4 text-left transition-colors',
                            isSelected
                              ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                              : 'border-stone-200 bg-white text-slate-700 hover:border-stone-300 hover:bg-stone-50',
                          ].join(' ')}
                          onClick={() => setForm((prev) => ({ ...prev, customerId: customer.id }))}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold">{getCustomerLabel(customer)}</p>
                              <p className="mt-1 text-xs text-slate-400">
                                Created {new Date(customer.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {isSelected ? (
                              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-700">
                                Selected
                              </span>
                            ) : null}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50/80 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                        Customer
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedCustomer ? getCustomerLabel(selectedCustomer) : 'No customer selected'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50"
                      onClick={() => setStep('customer')}
                    >
                      Change
                    </button>
                  </div>
                </div>

                <label className="form-control">
                  <span className="mb-2 text-sm font-semibold text-slate-700">Opportunity name</span>
                  <input
                    type="text"
                    className="input h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Quarterly renewal, pilot expansion, onboarding package..."
                  />
                </label>

                <label className="form-control">
                  <span className="mb-2 text-sm font-semibold text-slate-700">Current stage</span>
                  <select
                    className="select h-12 rounded-2xl border-stone-200 bg-stone-50/70 text-slate-900"
                    value={form.stage}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        stage: event.target.value as OpportunityStage,
                      }))
                    }
                  >
                    {OPPORTUNITY_STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {OPPORTUNITY_STAGE_LABELS[stage]}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            )}

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
              <div>
                {step === 'details' ? (
                  <button
                    type="button"
                    className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
                    onClick={() => setStep('customer')}
                  >
                    <HiOutlineArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn w-full rounded-2xl border border-stone-200 bg-white text-slate-700 shadow-none hover:bg-stone-50 sm:w-auto"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                )}
              </div>

              {step === 'customer' ? (
                <button
                  type="button"
                  className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
                  onClick={handleNext}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn w-full rounded-2xl border-0 bg-emerald-600 text-white shadow-[0_10px_24px_rgba(5,150,105,0.24)] hover:bg-emerald-700 sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <span className="loading loading-spinner loading-sm" /> : 'Create Opportunity'}
                </button>
              )}
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button type="button" onClick={handleClose}>close</button>
        </form>
      </dialog>

      <CreateCustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSubmit={handleCustomerCreate}
      />
    </>
  );
}
