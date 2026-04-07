import { useState } from 'react';
import {
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineGlobeAlt,
  HiOutlineMapPin,
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2';
import { EditFieldModal } from './EditFieldModal';
import type { CustomerDetail, UpdateCustomerPayload } from '@/types/customer';

interface CustomerProfileSectionProps {
  customer: CustomerDetail;
  canWrite: boolean;
  onUpdate: (payload: UpdateCustomerPayload) => Promise<void>;
}

interface FieldConfig {
  key: keyof UpdateCustomerPayload;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  getValue: (c: CustomerDetail) => string;
}

const FIELD_GROUPS: { title: string; fields: FieldConfig[] }[] = [
  {
    title: 'Identity',
    fields: [
      { key: 'firstName', label: 'First Name', icon: HiOutlineUser, getValue: (c) => c.firstName ?? '' },
      { key: 'lastName', label: 'Last Name', icon: HiOutlineUser, getValue: (c) => c.lastName ?? '' },
      { key: 'company', label: 'Company', icon: HiOutlineBuildingOffice2, getValue: (c) => c.company ?? '' },
    ],
  },
  {
    title: 'Contact',
    fields: [
      { key: 'email', label: 'Email', icon: HiOutlineEnvelope, getValue: (c) => c.email ?? '' },
      { key: 'phone', label: 'Phone', icon: HiOutlinePhone, getValue: (c) => c.phone ?? '' },
      { key: 'instagramHandle', label: 'Instagram', icon: HiOutlineGlobeAlt, getValue: (c) => c.instagramHandle ?? '' },
      { key: 'linkedinProfileUrl', label: 'LinkedIn', icon: HiOutlineGlobeAlt, getValue: (c) => c.linkedinProfileUrl ?? '' },
    ],
  },
  {
    title: 'Address',
    fields: [
      { key: 'address', label: 'Address', icon: HiOutlineMapPin, getValue: (c) => c.address ?? '' },
      { key: 'city', label: 'City', icon: HiOutlineMapPin, getValue: (c) => c.city ?? '' },
      { key: 'state', label: 'State', icon: HiOutlineMapPin, getValue: (c) => c.state ?? '' },
      { key: 'country', label: 'Country', icon: HiOutlineMapPin, getValue: (c) => c.country ?? '' },
      { key: 'zipCode', label: 'ZIP / Postal Code', icon: HiOutlineMapPin, getValue: (c) => c.zipCode ?? '' },
    ],
  },
  {
    title: 'Notes',
    fields: [
      { key: 'notes', label: 'Notes', icon: HiOutlineDocumentText, getValue: (c) => c.notes ?? '' },
    ],
  },
];

interface EditingField {
  key: keyof UpdateCustomerPayload;
  label: string;
  currentValue: string;
}

function getDisplayValue(field: FieldConfig, customer: CustomerDetail): string {
  const value = field.getValue(customer);
  if (!value) {
    return '';
  }

  if (field.key === 'instagramHandle') {
    return `@${value}`;
  }

  return value;
}

function getActionUrl(fieldKey: keyof UpdateCustomerPayload, value: string): string | null {
  if (!value) {
    return null;
  }

  if (fieldKey === 'instagramHandle') {
    return `https://www.instagram.com/${value}`;
  }

  if (fieldKey === 'linkedinProfileUrl') {
    return value;
  }

  return null;
}

export function CustomerProfileSection({ customer, canWrite, onUpdate }: CustomerProfileSectionProps) {
  const [editing, setEditing] = useState<EditingField | null>(null);

  const openEdit = (field: FieldConfig): void => {
    setEditing({ key: field.key, label: field.label, currentValue: field.getValue(customer) });
  };

  const handleSave = async (value: string): Promise<void> => {
    if (!editing) return;
    await onUpdate({ [editing.key]: value || undefined });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {FIELD_GROUPS.map((group) => (
          <section key={group.title} className="dashboard-panel overflow-hidden">
            <div className="border-b border-stone-200/80 px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{group.title}</p>
            </div>
            <div className="divide-y divide-stone-100">
              {group.fields.map((field) => {
                const value = field.getValue(customer);
                const displayValue = getDisplayValue(field, customer);
                const actionUrl = getActionUrl(field.key, value);
                const Icon = field.icon;
                return (
                  <div
                    key={field.key}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{field.label}</p>
                      <p className={`mt-0.5 truncate text-sm font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
                        {displayValue || 'Not set'}
                      </p>
                    </div>
                    {actionUrl ? (
                      <button
                        className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-emerald-700 shadow-none hover:border-emerald-300 hover:bg-emerald-50"
                        onClick={() => window.open(actionUrl, '_blank', 'noopener,noreferrer')}
                        aria-label={`Open ${field.label}`}
                      >
                        <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
                        <span className="hidden sm:inline">Open</span>
                      </button>
                    ) : null}
                    {canWrite ? (
                      <button
                        className="btn btn-sm rounded-2xl border border-stone-200 bg-white text-slate-500 shadow-none hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => openEdit(field)}
                        aria-label={`Edit ${field.label}`}
                      >
                        <HiOutlinePencilSquare className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {editing ? (
        <EditFieldModal
          key={editing.key}
          isOpen
          fieldKey={editing.key}
          fieldLabel={editing.label}
          currentValue={editing.currentValue}
          onClose={() => setEditing(null)}
          onSubmit={handleSave}
        />
      ) : null}
    </>
  );
}
