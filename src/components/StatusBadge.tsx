import React from 'react';
import { TransactionStatus } from '../types/transaction';
import { getStatusAriaLabel } from '../utils/formatters';

interface StatusBadgeProps {
  status: TransactionStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const ariaLabel = getStatusAriaLabel(status);

  return (
    <span
      className={`status-badge status-badge--${status.toLowerCase()}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">{status}</span>
    </span>
  );
};
