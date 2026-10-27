import React from 'react';
import {
  TransactionStatus,
  TransactionCategory,
  SortField,
  SortOrder,
} from '../types/transaction';

const ALL_STATUSES: TransactionStatus[] = ['Completed', 'Pending', 'Failed'];

const ALL_CATEGORIES: TransactionCategory[] = [
  'Technology',
  'Office Supplies',
  'Travel & Entertainment',
  'Marketing',
  'Utilities',
  'Payroll',
  'Legal & Professional',
  'Healthcare',
];

interface FilterBarProps {
  searchQuery: string;
  selectedStatus: TransactionStatus | 'ALL';
  selectedCategory: TransactionCategory | 'ALL';
  sortField: SortField;
  sortOrder: SortOrder;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: TransactionStatus | 'ALL') => void;
  onCategoryChange: (category: TransactionCategory | 'ALL') => void;
  onSortFieldChange: (field: SortField) => void;
  onSortOrderToggle: () => void;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  selectedStatus,
  selectedCategory,
  sortField,
  sortOrder,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onSortFieldChange,
  onSortOrderToggle,
  onResetFilters,
}) => {
  return (
    <div className="filter-bar" role="search" aria-label="Transactions filter and search controls">
      <div className="filter-bar__top">
        {/* Search Input */}
        <div className="filter-group filter-group--search">
          <label htmlFor="transaction-search" className="filter-label">
            Search
          </label>
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="transaction-search"
              type="text"
              className="input search-input"
              placeholder="Search description or ID (e.g. TXN-90141)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search transactions by description or ID"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <label htmlFor="filter-status" className="filter-label">
            Status
          </label>
          <select
            id="filter-status"
            className="select filter-select"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as TransactionStatus | 'ALL')}
            aria-label="Filter by transaction status"
          >
            <option value="ALL">All Statuses</option>
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="filter-category" className="filter-label">
            Category
          </label>
          <select
            id="filter-category"
            className="select filter-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value as TransactionCategory | 'ALL')}
            aria-label="Filter by transaction category"
          >
            <option value="ALL">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Controls */}
        <div className="filter-group filter-group--sort">
          <label htmlFor="sort-field" className="filter-label">
            Sort By
          </label>
          <div className="sort-controls-wrapper">
            <select
              id="sort-field"
              className="select filter-select sort-select"
              value={sortField}
              onChange={(e) => onSortFieldChange(e.target.value as SortField)}
              aria-label="Sort transactions by field"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
            <button
              type="button"
              className="btn btn--secondary btn--icon"
              onClick={onSortOrderToggle}
              title={`Switch to ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              aria-label={`Sort direction currently ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}. Click to toggle.`}
            >
              {sortOrder === 'asc' ? '▲ Asc' : '▼ Desc'}
            </button>
          </div>
        </div>

        {/* Reset Filters Button */}
        <div className="filter-group filter-group--reset">
          <label className="filter-label invisible-label" aria-hidden="true">
            Action
          </label>
          <button
            type="button"
            className={`btn btn--reset ${hasActiveFilters ? 'btn--reset-active' : ''}`}
            onClick={onResetFilters}
            disabled={!hasActiveFilters}
            aria-label="Reset all search, category, status and sort filters"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};
