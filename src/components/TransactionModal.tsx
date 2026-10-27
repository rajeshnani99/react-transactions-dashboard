import React, { useEffect, useRef } from 'react';
import { Transaction } from '../types/transaction';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!transaction) return;

    // Focus close button on open
    closeButtonRef.current?.focus();

    // Escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [transaction, onClose]);

  if (!transaction) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
      data-testid="transaction-modal-backdrop"
    >
      <div
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-info">
            <span className="modal-eyebrow">Transaction Details</span>
            <h2 id="modal-title" className="modal-title">
              {transaction.id}
            </h2>
          </div>
          <div className="modal-header-actions">
            <StatusBadge status={transaction.status} />
            <button
              ref={closeButtonRef}
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close transaction details"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Main Amount Card */}
          <div className="modal-amount-box">
            <span className="modal-amount-label">Total Amount</span>
            <span className="modal-amount-value" data-testid="modal-amount">
              {formatCurrency(transaction.amount)}
            </span>
          </div>

          {/* Details Grid */}
          <dl className="modal-details-grid">
            <div className="modal-detail-item">
              <dt className="modal-detail-label">Description</dt>
              <dd className="modal-detail-value" data-testid="modal-desc">
                {transaction.description}
              </dd>
            </div>

            <div className="modal-detail-item">
              <dt className="modal-detail-label">Category</dt>
              <dd className="modal-detail-value">
                <span className="category-pill">{transaction.category}</span>
              </dd>
            </div>

            <div className="modal-detail-item">
              <dt className="modal-detail-label">Date & Time</dt>
              <dd className="modal-detail-value">
                {formatDate(transaction.date, true)}
              </dd>
            </div>

            <div className="modal-detail-item">
              <dt className="modal-detail-label">Merchant</dt>
              <dd className="modal-detail-value">
                {transaction.merchant || 'N/A'}
              </dd>
            </div>

            <div className="modal-detail-item">
              <dt className="modal-detail-label">Payment Method</dt>
              <dd className="modal-detail-value">
                {transaction.paymentMethod || 'Direct Billing'}
              </dd>
            </div>

            <div className="modal-detail-item">
              <dt className="modal-detail-label">Reference Number</dt>
              <dd className="modal-detail-value">
                <code className="reference-code">{transaction.referenceNumber || 'N/A'}</code>
              </dd>
            </div>

            {transaction.notes && (
              <div className="modal-detail-item modal-detail-item--full">
                <dt className="modal-detail-label">Notes & Audit Trail</dt>
                <dd className="modal-detail-value modal-notes-value">
                  {transaction.notes}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
