import { TransactionStatus } from '../types/transaction';

/**
 * Formats a numeric amount to USD currency string.
 * Defensive against undefined, null, or NaN.
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `$${Number(amount).toFixed(2)}`;
  }
}

/**
 * Formats an ISO date string to a human-readable format.
 * Example: 'Oct 26, 2026, 02:30 PM' or 'Oct 26, 2026'
 */
export function formatDate(dateString: string | null | undefined, includeTime = false): string {
  if (!dateString) {
    return 'N/A';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'Invalid Date';
  }

  try {
    if (includeTime) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    }

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Returns accessible description or aria attributes for status.
 */
export function getStatusAriaLabel(status: TransactionStatus): string {
  switch (status) {
    case 'Completed':
      return 'Status: Completed successfully';
    case 'Pending':
      return 'Status: Pending processing';
    case 'Failed':
      return 'Status: Failed transaction';
    default:
      return `Status: ${status}`;
  }
}
