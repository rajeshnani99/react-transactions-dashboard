import React from 'react';

interface LoadingStateProps {
  rowCount?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ rowCount = 6 }) => {
  return (
    <div className="state-container loading-container" role="status" aria-live="polite">
      <div className="loading-spinner-wrapper">
        <div className="spinner" aria-hidden="true" />
        <p className="loading-text">Loading transaction records...</p>
      </div>

      <div className="skeleton-table">
        <div className="skeleton-table-header" />
        {Array.from({ length: rowCount }).map((_, idx) => (
          <div key={idx} className="skeleton-table-row">
            <div className="skeleton skeleton-cell skeleton-cell--sm" />
            <div className="skeleton skeleton-cell skeleton-cell--lg" />
            <div className="skeleton skeleton-cell skeleton-cell--md" />
            <div className="skeleton skeleton-cell skeleton-cell--sm" />
            <div className="skeleton skeleton-cell skeleton-cell--sm" />
            <div className="skeleton skeleton-cell skeleton-cell--xs" />
          </div>
        ))}
      </div>
    </div>
  );
};

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="state-container error-state" role="alert" aria-live="assertive">
      <div className="state-icon-circle state-icon-circle--error" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h3 className="state-title">Unable to Load Transactions</h3>
      <p className="state-description">{message}</p>
      <button type="button" className="btn btn--primary" onClick={onRetry}>
        Retry Request
      </button>
    </div>
  );
};

export const EmptyState: React.FC = () => {
  return (
    <div className="state-container empty-state" role="status">
      <div className="state-icon-circle state-icon-circle--neutral" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M7 15h10M7 9h10" />
        </svg>
      </div>
      <h3 className="state-title">No Transactions Recorded</h3>
      <p className="state-description">
        There are currently no transactions in this account. Once transactions occur, they will appear here.
      </p>
    </div>
  );
};

interface NoSearchResultsStateProps {
  searchQuery: string;
  onResetFilters: () => void;
}

export const NoSearchResultsState: React.FC<NoSearchResultsStateProps> = ({
  searchQuery,
  onResetFilters,
}) => {
  return (
    <div className="state-container no-results-state" role="status">
      <div className="state-icon-circle state-icon-circle--neutral" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="8" x2="14" y2="14" />
          <line x1="14" y1="8" x2="8" y2="14" />
        </svg>
      </div>
      <h3 className="state-title">No Matching Transactions Found</h3>
      <p className="state-description">
        {searchQuery ? (
          <>
            No records matched <strong className="state-query-highlight">"{searchQuery}"</strong> with current filter settings.
          </>
        ) : (
          'No records matched the selected status and category filter criteria.'
        )}
      </p>
      <button type="button" className="btn btn--secondary" onClick={onResetFilters}>
        Reset All Filters
      </button>
    </div>
  );
};
