import {
  Transaction,
  FilterState,
  SummaryMetrics,
  SortField,
  SortOrder,
} from '../types/transaction';

/**
 * Filters transactions by search query (matching description or ID),
 * status, and category.
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: Pick<FilterState, 'searchQuery' | 'selectedStatus' | 'selectedCategory'>
): Transaction[] {
  const query = (filters.searchQuery || '').trim().toLowerCase();
  const statusFilter = filters.selectedStatus;
  const categoryFilter = filters.selectedCategory;

  return transactions.filter((tx) => {
    // Status Filter
    if (statusFilter !== 'ALL' && tx.status !== statusFilter) {
      return false;
    }

    // Category Filter
    if (categoryFilter !== 'ALL' && tx.category !== categoryFilter) {
      return false;
    }

    // Search Query (matches description or ID)
    if (query) {
      const matchDesc = tx.description.toLowerCase().includes(query);
      const matchId = tx.id.toLowerCase().includes(query);
      if (!matchDesc && !matchId) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sorts transactions by date or amount, in ascending or descending order.
 * Uses stable tie-breaker (id) for deterministic ordering.
 */
export function sortTransactions(
  transactions: Transaction[],
  sort: { sortField: SortField; sortOrder: SortOrder }
): Transaction[] {
  const { sortField, sortOrder } = sort;
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  return [...transactions].sort((a, b) => {
    if (sortField === 'amount') {
      const diff = a.amount - b.amount;
      if (diff !== 0) {
        return diff * multiplier;
      }
    } else if (sortField === 'date') {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      const diff = timeA - timeB;
      if (diff !== 0) {
        return diff * multiplier;
      }
    }

    // Fallback tie-breaker
    return a.id.localeCompare(b.id);
  });
}

/**
 * Computes the slice of transactions for the requested page.
 * Safely guards against negative pages or out of range pages.
 */
export function paginateTransactions(
  transactions: Transaction[],
  pagination: { currentPage: number; pageSize: number }
): Transaction[] {
  const { currentPage, pageSize } = pagination;
  const validPageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(transactions.length / validPageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validPage - 1) * validPageSize;
  const endIndex = startIndex + validPageSize;

  return transactions.slice(startIndex, endIndex);
}

/**
 * Calculates summary metrics (total count, completed count, total value, etc.)
 * from a list of transactions.
 */
export function calculateMetrics(transactions: Transaction[]): SummaryMetrics {
  return transactions.reduce<SummaryMetrics>(
    (acc, tx) => {
      acc.totalCount += 1;
      acc.totalValue += tx.amount || 0;

      if (tx.status === 'Completed') {
        acc.completedCount += 1;
        acc.completedValue += tx.amount || 0;
      } else if (tx.status === 'Pending') {
        acc.pendingCount += 1;
      } else if (tx.status === 'Failed') {
        acc.failedCount += 1;
      }

      return acc;
    },
    {
      totalCount: 0,
      completedCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalValue: 0,
      completedValue: 0,
    }
  );
}

/**
 * Computes total pages safely.
 */
export function calculateTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) return 1;
  const validPageSize = Math.max(1, pageSize);
  return Math.max(1, Math.ceil(totalItems / validPageSize));
}
