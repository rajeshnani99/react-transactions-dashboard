import React from 'react';
import { SummaryMetrics } from '../types/transaction';
import { formatCurrency } from '../utils/formatters';

interface SummaryCardsProps {
  metrics: SummaryMetrics;
  loading?: boolean;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, loading = false }) => {
  const completionRate =
    metrics.totalCount > 0
      ? Math.round((metrics.completedCount / metrics.totalCount) * 100)
      : 0;

  if (loading) {
    return (
      <div className="summary-cards-grid" aria-label="Summary statistics loading">
        {[1, 2, 3].map((key) => (
          <div key={key} className="summary-card skeleton-card">
            <div className="skeleton skeleton-title" />
            <div className="skeleton skeleton-value" />
            <div className="skeleton skeleton-sub" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="summary-cards-grid" aria-label="Transaction summary statistics">
      {/* Total Transactions Card */}
      <div className="summary-card">
        <div className="summary-card__header">
          <span className="summary-card__title">Total Transactions</span>
          <div className="summary-card__icon-badge" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
        </div>
        <div className="summary-card__value" data-testid="metric-total-count">
          {metrics.totalCount}
        </div>
        <div className="summary-card__footer">
          <span className="summary-card__pill summary-card__pill--info">
            {metrics.pendingCount} pending · {metrics.failedCount} failed
          </span>
        </div>
      </div>

      {/* Completed Transactions Card */}
      <div className="summary-card">
        <div className="summary-card__header">
          <span className="summary-card__title">Completed Transactions</span>
          <div className="summary-card__icon-badge summary-card__icon-badge--success" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        </div>
        <div className="summary-card__value" data-testid="metric-completed-count">
          {metrics.completedCount}
        </div>
        <div className="summary-card__footer">
          <span className="summary-card__pill summary-card__pill--success">
            {completionRate}% completion rate
          </span>
        </div>
      </div>

      {/* Total Transaction Value Card */}
      <div className="summary-card">
        <div className="summary-card__header">
          <span className="summary-card__title">Total Transaction Value</span>
          <div className="summary-card__icon-badge summary-card__icon-badge--value" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="summary-card__value" data-testid="metric-total-value">
          {formatCurrency(metrics.totalValue)}
        </div>
        <div className="summary-card__footer">
          <span className="summary-card__pill summary-card__pill--accent">
            {formatCurrency(metrics.completedValue)} settled
          </span>
        </div>
      </div>
    </section>
  );
};
