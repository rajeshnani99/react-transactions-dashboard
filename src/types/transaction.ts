export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export type TransactionCategory =
  | 'Technology'
  | 'Office Supplies'
  | 'Travel & Entertainment'
  | 'Marketing'
  | 'Utilities'
  | 'Payroll'
  | 'Legal & Professional'
  | 'Healthcare';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO 8601 string, e.g., '2026-10-24T14:30:00Z'
  category: TransactionCategory;
  status: TransactionStatus;
  // Extended details for details view
  merchant?: string;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
}

export type SortField = 'date' | 'amount';
export type SortOrder = 'asc' | 'desc';

export interface FilterState {
  searchQuery: string;
  selectedStatus: TransactionStatus | 'ALL';
  selectedCategory: TransactionCategory | 'ALL';
  sortField: SortField;
  sortOrder: SortOrder;
  currentPage: number;
  pageSize: number;
}

export interface SummaryMetrics {
  totalCount: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  totalValue: number;
  completedValue: number;
}
