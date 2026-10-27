import React from 'react';

interface HeaderProps {
  loading: boolean;
  apiEndpoint: string;
  isLiveApi: boolean;
  onRefresh: () => void;
  onSimulateError: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  loading,
  apiEndpoint,
  isLiveApi,
  onRefresh,
  onSimulateError,
}) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="header-logo-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="2" y1="8" x2="22" y2="8" />
            <circle cx="6" cy="13" r="1" />
            <circle cx="10" cy="13" r="1" />
          </svg>
        </div>
        <div>
          <h1 className="header-title">Transactions Dashboard</h1>
          <p className="header-subtitle">
            Enterprise Financial Audit & Payment Operations
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div
          className="system-status-indicator"
          title={`Endpoint: ${apiEndpoint} (${isLiveApi ? 'Live Backend Connected' : 'Local Standalone Mode'})`}
        >
          <span className={`status-pulse-dot ${isLiveApi ? '' : 'status-pulse-dot--mock'}`} />
          <span className="status-text">{isLiveApi ? 'API Connected' : 'Local Data'}</span>
        </div>

        <button
          type="button"
          className="btn btn--secondary btn--sm"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh transactions data"
        >
          <svg
            className={loading ? 'spinning-icon' : ''}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>

        <button
          type="button"
          className="btn btn--ghost btn--sm btn--warning-ghost"
          onClick={onSimulateError}
          title="Simulate network error to test error boundary & retry state"
          aria-label="Simulate network error"
        >
          Simulate Error
        </button>
      </div>
    </header>
  );
};
