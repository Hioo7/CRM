export interface RenderedMessageSegment {
  value: string;
  isUnresolved: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function buildRenderedMessageSegments(
  content: string,
  unresolvedPlaceholders: string[],
): RenderedMessageSegment[] {
  if (unresolvedPlaceholders.length === 0) {
    return [{ value: content, isUnresolved: false }];
  }

  const pattern = new RegExp(
    `(${unresolvedPlaceholders.map((placeholder) => escapeRegExp(placeholder)).join('|')})`,
    'g',
  );

  return content
    .split(pattern)
    .filter((segment) => segment.length > 0)
    .map((segment) => ({
      value: segment,
      isUnresolved: unresolvedPlaceholders.includes(segment),
    }));
}

export function getCustomerDisplayName(customer: {
  firstName: string | null;
  lastName: string | null;
  company: string | null;
}): string {
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(' ');
  if (customer.company && fullName) {
    return `${fullName} - ${customer.company}`;
  }

  if (customer.company) {
    return customer.company;
  }

  return fullName || 'Unnamed customer';
}
