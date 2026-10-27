/**
 * Production API Configuration
 *
 * Defaults to standard REST conventions (/api/transactions).
 * Overridable via VITE_API_BASE_URL in environment configuration.
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  ENDPOINTS: {
    TRANSACTIONS: '/transactions',
    TRANSACTION_BY_ID: (id: string) => `/transactions/${encodeURIComponent(id)}`,
    SUMMARY_METRICS: '/transactions/metrics',
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  TIMEOUT_MS: 15000,
} as const;
