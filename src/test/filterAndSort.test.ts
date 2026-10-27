import { describe, it, expect } from 'vitest';
import { Transaction } from '../types/transaction';
import {
  filterTransactions,
  sortTransactions,
  paginateTransactions,
  calculateMetrics,
  calculateTotalPages,
} from '../utils/filterAndSort';

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-001',
    description: 'AWS Cloud Hosting',
    amount: 1500.0,
    date: '2026-10-20T10:00:00Z',
    category: 'Technology',
    status: 'Completed',
  },
  {
    id: 'TXN-002',
    description: 'Figma Design Suite',
    amount: 500.0,
    date: '2026-10-22T10:00:00Z',
    category: 'Technology',
    status: 'Pending',
  },
  {
    id: 'TXN-003',
    description: 'Delta Airlines Flight',
    amount: 850.0,
    date: '2026-10-18T10:00:00Z',
    category: 'Travel & Entertainment',
    status: 'Completed',
  },
  {
    id: 'TXN-004',
    description: 'Office Snacks & Coffee',
    amount: 120.0,
    date: '2026-10-15T10:00:00Z',
    category: 'Office Supplies',
    status: 'Failed',
  },
  {
    id: 'TXN-005',
    description: 'Gusto Payroll Run',
    amount: 12000.0,
    date: '2026-10-25T10:00:00Z',
    category: 'Payroll',
    status: 'Completed',
  },
];

describe('filterAndSort pure functions', () => {
  describe('filterTransactions', () => {
    it('returns all transactions when filters are ALL and query is empty', () => {
      const results = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: '',
        selectedStatus: 'ALL',
        selectedCategory: 'ALL',
      });
      expect(results).toHaveLength(5);
    });

    it('searches by description substring (case-insensitive)', () => {
      const results = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: 'cloud',
        selectedStatus: 'ALL',
        selectedCategory: 'ALL',
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('TXN-001');
    });

    it('searches by transaction ID (case-insensitive)', () => {
      const results = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: 'txn-003',
        selectedStatus: 'ALL',
        selectedCategory: 'ALL',
      });
      expect(results).toHaveLength(1);
      expect(results[0].description).toBe('Delta Airlines Flight');
    });

    it('filters by status correctly', () => {
      const completed = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: '',
        selectedStatus: 'Completed',
        selectedCategory: 'ALL',
      });
      expect(completed).toHaveLength(3);
      expect(completed.every((tx) => tx.status === 'Completed')).toBe(true);

      const failed = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: '',
        selectedStatus: 'Failed',
        selectedCategory: 'ALL',
      });
      expect(failed).toHaveLength(1);
      expect(failed[0].id).toBe('TXN-004');
    });

    it('filters by category correctly', () => {
      const tech = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: '',
        selectedStatus: 'ALL',
        selectedCategory: 'Technology',
      });
      expect(tech).toHaveLength(2);
      expect(tech.map((t) => t.id)).toEqual(['TXN-001', 'TXN-002']);
    });

    it('combines search, status, and category simultaneously', () => {
      const results = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: 'figma',
        selectedStatus: 'Pending',
        selectedCategory: 'Technology',
      });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('TXN-002');
    });

    it('returns empty array when search matches nothing', () => {
      const results = filterTransactions(SAMPLE_TRANSACTIONS, {
        searchQuery: 'NonExistentMerchantOrKeyword',
        selectedStatus: 'ALL',
        selectedCategory: 'ALL',
      });
      expect(results).toHaveLength(0);
    });
  });

  describe('sortTransactions', () => {
    it('sorts by amount ascending', () => {
      const sorted = sortTransactions(SAMPLE_TRANSACTIONS, {
        sortField: 'amount',
        sortOrder: 'asc',
      });
      expect(sorted[0].amount).toBe(120.0);
      expect(sorted[sorted.length - 1].amount).toBe(12000.0);
    });

    it('sorts by amount descending', () => {
      const sorted = sortTransactions(SAMPLE_TRANSACTIONS, {
        sortField: 'amount',
        sortOrder: 'desc',
      });
      expect(sorted[0].amount).toBe(12000.0);
      expect(sorted[sorted.length - 1].amount).toBe(120.0);
    });

    it('sorts by date descending (newest first)', () => {
      const sorted = sortTransactions(SAMPLE_TRANSACTIONS, {
        sortField: 'date',
        sortOrder: 'desc',
      });
      expect(sorted[0].id).toBe('TXN-005'); // Oct 25
      expect(sorted[sorted.length - 1].id).toBe('TXN-004'); // Oct 15
    });

    it('sorts by date ascending (oldest first)', () => {
      const sorted = sortTransactions(SAMPLE_TRANSACTIONS, {
        sortField: 'date',
        sortOrder: 'asc',
      });
      expect(sorted[0].id).toBe('TXN-004'); // Oct 15
      expect(sorted[sorted.length - 1].id).toBe('TXN-005'); // Oct 25
    });

    it('does not mutate original array', () => {
      const copy = [...SAMPLE_TRANSACTIONS];
      sortTransactions(SAMPLE_TRANSACTIONS, { sortField: 'amount', sortOrder: 'asc' });
      expect(SAMPLE_TRANSACTIONS).toEqual(copy);
    });
  });

  describe('paginateTransactions & calculateTotalPages', () => {
    it('paginates accurately for page 1 and page 2', () => {
      const page1 = paginateTransactions(SAMPLE_TRANSACTIONS, { currentPage: 1, pageSize: 2 });
      expect(page1).toHaveLength(2);
      expect(page1[0].id).toBe('TXN-001');
      expect(page1[1].id).toBe('TXN-002');

      const page2 = paginateTransactions(SAMPLE_TRANSACTIONS, { currentPage: 2, pageSize: 2 });
      expect(page2).toHaveLength(2);
      expect(page2[0].id).toBe('TXN-003');
      expect(page2[1].id).toBe('TXN-004');

      const page3 = paginateTransactions(SAMPLE_TRANSACTIONS, { currentPage: 3, pageSize: 2 });
      expect(page3).toHaveLength(1);
      expect(page3[0].id).toBe('TXN-005');
    });

    it('handles out of bounds page numbers safely', () => {
      // Clamps to max page
      const clampedPage = paginateTransactions(SAMPLE_TRANSACTIONS, { currentPage: 99, pageSize: 2 });
      expect(clampedPage).toHaveLength(1);
      expect(clampedPage[0].id).toBe('TXN-005');

      // Clamps to page 1 for negative / zero
      const clampedZero = paginateTransactions(SAMPLE_TRANSACTIONS, { currentPage: 0, pageSize: 2 });
      expect(clampedZero).toHaveLength(2);
      expect(clampedZero[0].id).toBe('TXN-001');
    });

    it('calculates total pages correctly', () => {
      expect(calculateTotalPages(5, 2)).toBe(3);
      expect(calculateTotalPages(4, 2)).toBe(2);
      expect(calculateTotalPages(0, 10)).toBe(1);
    });
  });

  describe('calculateMetrics', () => {
    it('computes correct totals and status breakdowns', () => {
      const metrics = calculateMetrics(SAMPLE_TRANSACTIONS);
      expect(metrics.totalCount).toBe(5);
      expect(metrics.completedCount).toBe(3);
      expect(metrics.pendingCount).toBe(1);
      expect(metrics.failedCount).toBe(1);
      expect(metrics.totalValue).toBe(1500 + 500 + 850 + 120 + 12000);
      expect(metrics.completedValue).toBe(1500 + 850 + 12000);
    });

    it('handles empty transaction list gracefully', () => {
      const metrics = calculateMetrics([]);
      expect(metrics.totalCount).toBe(0);
      expect(metrics.completedCount).toBe(0);
      expect(metrics.pendingCount).toBe(0);
      expect(metrics.failedCount).toBe(0);
      expect(metrics.totalValue).toBe(0);
      expect(metrics.completedValue).toBe(0);
    });
  });
});
