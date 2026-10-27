import React from 'react';
import { useTransactions } from './hooks/useTransactions';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { TransactionsTable } from './components/TransactionsTable';
import { Pagination } from './components/Pagination';
import { TransactionModal } from './components/TransactionModal';
import {
  LoadingState,
  ErrorState,
  EmptyState,
  NoSearchResultsState,
} from './components/StateView';

export const App: React.FC = () => {
  const {
    rawTransactions,
    loading,
    error,
    apiEndpoint,
    isLiveApi,
    filters,
    hasActiveFilters,
    paginatedTransactions,
    filteredCount,
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
  } = useTransactions();

  return (
    <div className="dashboard-layout">
      {/* App Header */}
      <Header
        loading={loading}
        apiEndpoint={apiEndpoint}
        isLiveApi={isLiveApi}
        onRefresh={refetch}
        onSimulateError={simulateError}
      />

      <main className="dashboard-content" id="main-content">
        {/* Top Summary Cards */}
        <SummaryCards
          metrics={summaryMetrics}
          loading={loading && rawTransactions.length === 0}
        />

        {/* Transactions Panel */}
        <section className="transactions-panel" aria-label="Transactions explorer">
          <div className="panel-header">
            <div>
              <h2 className="panel-title">Transactions Activity</h2>
              <p className="panel-subtitle">
                Inspect, filter, sort, and reconcile corporate payment transactions.
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          <FilterBar
            searchQuery={filters.searchQuery}
            selectedStatus={filters.selectedStatus}
            selectedCategory={filters.selectedCategory}
            sortField={filters.sortField}
            sortOrder={filters.sortOrder}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatus}
            onCategoryChange={setCategory}
            onSortFieldChange={handleSort}
            onSortOrderToggle={() => handleSort(filters.sortField)}
            onResetFilters={resetFilters}
          />

          {/* Dynamic Content Views */}
          <div className="panel-body">
            {loading && rawTransactions.length === 0 ? (
              <LoadingState rowCount={filters.pageSize} />
            ) : error ? (
              <ErrorState message={error} onRetry={refetch} />
            ) : rawTransactions.length === 0 ? (
              <EmptyState />
            ) : filteredCount === 0 ? (
              <NoSearchResultsState
                searchQuery={filters.searchQuery}
                onResetFilters={resetFilters}
              />
            ) : (
              <>
                <TransactionsTable
                  transactions={paginatedTransactions}
                  sortField={filters.sortField}
                  sortOrder={filters.sortOrder}
                  onSort={handleSort}
                  onSelectTransaction={selectTransaction}
                />

                <Pagination
                  currentPage={filters.currentPage}
                  totalPages={totalPages}
                  pageSize={filters.pageSize}
                  totalItems={filteredCount}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                />
              </>
            )}
          </div>
        </section>
      </main>

      {/* Transaction Details Modal */}
      <TransactionModal
        transaction={selectedTransaction}
        onClose={() => selectTransaction(null)}
      />
    </div>
  );
};

export default App;
