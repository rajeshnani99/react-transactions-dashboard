import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Transaction,
  TransactionStatus,
  TransactionCategory,
  SortField,
  FilterState,
  SummaryMetrics,
} from '../types/transaction';
import { transactionsApi } from '../api/transactions.api';
import { API_CONFIG } from '../config/api.config';
import {
  filterTransactions,
  sortTransactions,
  paginateTransactions,
  calculateMetrics,
  calculateTotalPages,
} from '../utils/filterAndSort';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  selectedStatus: 'ALL',
  selectedCategory: 'ALL',
  sortField: 'date',
  sortOrder: 'desc',
  currentPage: 1,
  pageSize: 10,
};

export interface UseTransactionsReturn {
  // Raw state
  rawTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  apiEndpoint: string;
  isLiveApi: boolean;

  // Filter state
  filters: FilterState;
  hasActiveFilters: boolean;

  // Derived output
  paginatedTransactions: Transaction[];
  filteredCount: number;
  totalPages: number;
  summaryMetrics: SummaryMetrics;

  // Selection
  selectedTransaction: Transaction | null;

  // Actions
  setSearchQuery: (query: string) => void;
  setStatus: (status: TransactionStatus | 'ALL') => void;
  setCategory: (category: TransactionCategory | 'ALL') => void;
  handleSort: (field: SortField) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  resetFilters: () => void;
  selectTransaction: (tx: Transaction | null) => void;
  refetch: () => void;
  simulateError: () => void;
}

export function useTransactions(): UseTransactionsReturn {
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [shouldSimulateError, setShouldSimulateError] = useState<boolean>(false);

  // Fetch data from transactions API service
  const loadData = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    if (shouldSimulateError) {
      setTimeout(() => {
        setError('Simulated payment network error occurred. Please click Retry.');
        setRawTransactions([]);
        setLoading(false);
      }, 300);
      return;
    }

    try {
      const response = await transactionsApi.getTransactions(
        {
          search: filters.searchQuery,
          status: filters.selectedStatus,
          category: filters.selectedCategory,
          sortField: filters.sortField,
          sortOrder: filters.sortOrder,
          page: filters.currentPage,
          pageSize: filters.pageSize,
        },
        signal
      );

      setRawTransactions(response.transactions);
      setIsLiveApi(!response.isFallbackMock);
      setError(null);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch transactions from API.');
        setRawTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  }, [
    shouldSimulateError,
    filters.searchQuery,
    filters.selectedStatus,
    filters.selectedCategory,
    filters.sortField,
    filters.sortOrder,
    filters.currentPage,
    filters.pageSize,
  ]);

  useEffect(() => {
    const controller = new AbortController();
    loadData(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadData]);

  // Actions
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
      currentPage: 1, // Reset page on filter change
    }));
  }, []);

  const setStatus = useCallback((status: TransactionStatus | 'ALL') => {
    setFilters((prev) => ({
      ...prev,
      selectedStatus: status,
      currentPage: 1,
    }));
  }, []);

  const setCategory = useCallback((category: TransactionCategory | 'ALL') => {
    setFilters((prev) => ({
      ...prev,
      selectedCategory: category,
      currentPage: 1,
    }));
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setFilters((prev) => {
      if (prev.sortField === field) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
          currentPage: 1,
        };
      }
      return {
        ...prev,
        sortField: field,
        sortOrder: 'desc',
        currentPage: 1,
      };
    });
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      currentPage: page,
    }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setFilters((prev) => ({
      ...prev,
      pageSize: size,
      currentPage: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters((prev) => ({
      ...DEFAULT_FILTERS,
      pageSize: prev.pageSize,
    }));
  }, []);

  const selectTransaction = useCallback((tx: Transaction | null) => {
    setSelectedTransaction(tx);
  }, []);

  const refetch = useCallback(() => {
    setShouldSimulateError(false);
    loadData();
  }, [loadData]);

  const simulateError = useCallback(() => {
    setShouldSimulateError(true);
    setLoading(true);
    setTimeout(() => {
      setError('Simulated payment network error occurred. Please click Retry.');
      setRawTransactions([]);
      setLoading(false);
    }, 300);
  }, []);

  // Summary Metrics calculated over loaded dataset
  const summaryMetrics = useMemo(() => {
    return calculateMetrics(rawTransactions);
  }, [rawTransactions]);

  // Client-side Filter
  const filteredTransactions = useMemo(() => {
    return filterTransactions(rawTransactions, {
      searchQuery: filters.searchQuery,
      selectedStatus: filters.selectedStatus,
      selectedCategory: filters.selectedCategory,
    });
  }, [rawTransactions, filters.searchQuery, filters.selectedStatus, filters.selectedCategory]);

  // Client-side Sort
  const sortedTransactions = useMemo(() => {
    return sortTransactions(filteredTransactions, {
      sortField: filters.sortField,
      sortOrder: filters.sortOrder,
    });
  }, [filteredTransactions, filters.sortField, filters.sortOrder]);

  // Client-side Paginate
  const paginatedTransactions = useMemo(() => {
    return paginateTransactions(sortedTransactions, {
      currentPage: filters.currentPage,
      pageSize: filters.pageSize,
    });
  }, [sortedTransactions, filters.currentPage, filters.pageSize]);

  const totalPages = useMemo(() => {
    return calculateTotalPages(sortedTransactions.length, filters.pageSize);
  }, [sortedTransactions.length, filters.pageSize]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchQuery.trim() !== '' ||
      filters.selectedStatus !== 'ALL' ||
      filters.selectedCategory !== 'ALL' ||
      filters.sortField !== DEFAULT_FILTERS.sortField ||
      filters.sortOrder !== DEFAULT_FILTERS.sortOrder
    );
  }, [filters]);

  return {
    rawTransactions,
    loading,
    error,
    apiEndpoint: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`,
    isLiveApi,
    filters,
    hasActiveFilters,
    paginatedTransactions,
    filteredCount: sortedTransactions.length,
    totalPages,
    summaryMetrics,
    selectedTransaction,
    setSearchQuery,
    setStatus,
    setCategory,
    handleSort,
    setPage,
    setPageSize,
    resetFilters,
    selectTransaction,
    refetch,
    simulateError,
  };
}
