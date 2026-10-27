import React from 'react';
import { Transaction, SortField, SortOrder } from '../types/transaction';
import { formatCurrency, formatDate } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface TransactionsTableProps {
  transactions: Transaction[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onSelectTransaction: (transaction: Transaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  sortField,
  sortOrder,
  onSort,
  onSelectTransaction,
}) => {
  const getSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <span className="sort-indicator sort-indicator--inactive">↕</span>;
    }
    return (
      <span className="sort-indicator sort-indicator--active">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const getAriaSort = (field: SortField): 'ascending' | 'descending' | 'none' => {
    if (sortField !== field) return 'none';
    return sortOrder === 'asc' ? 'ascending' : 'descending';
  };

  return (
    <div className="table-responsive-wrapper" tabIndex={0} aria-label="Transactions table scroll area">
      <table className="transactions-table" aria-label="Transactions List">
        <thead>
          <tr>
            <th scope="col" className="th-id">
              Transaction ID
            </th>
            <th scope="col" className="th-desc">
              Description
            </th>
            <th scope="col" className="th-category">
              Category
            </th>
            <th
              scope="col"
              className="th-sortable th-date"
              aria-sort={getAriaSort('date')}
            >
              <button
                type="button"
                className="th-sort-button"
                onClick={() => onSort('date')}
                aria-label={`Sort by Date. Currently sorted ${getAriaSort('date')}`}
              >
                Date {getSortIndicator('date')}
              </button>
            </th>
            <th
              scope="col"
              className="th-sortable th-amount text-right"
              aria-sort={getAriaSort('amount')}
            >
              <button
                type="button"
                className="th-sort-button"
                onClick={() => onSort('amount')}
                aria-label={`Sort by Amount. Currently sorted ${getAriaSort('amount')}`}
              >
                Amount {getSortIndicator('amount')}
              </button>
            </th>
            <th scope="col" className="th-status text-center">
              Status
            </th>
            <th scope="col" className="th-actions text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.id}
              className="transaction-row"
              data-testid={`transaction-row-${tx.id}`}
              onClick={() => onSelectTransaction(tx)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectTransaction(tx);
                }
              }}
              tabIndex={0}
              aria-label={`Transaction ${tx.id}, ${tx.description}, ${formatCurrency(tx.amount)}, status ${tx.status}. Press Enter or click to view full details.`}
            >
              <td className="td-id">
                <code className="transaction-id-code">{tx.id}</code>
              </td>
              <td className="td-desc">
                <div className="description-cell">
                  <span className="tx-description-text">{tx.description}</span>
                  {tx.merchant && (
                    <span className="tx-merchant-text">{tx.merchant}</span>
                  )}
                </div>
              </td>
              <td className="td-category">
                <span className="category-pill">{tx.category}</span>
              </td>
              <td className="td-date">{formatDate(tx.date)}</td>
              <td className="td-amount text-right">
                <span className="tx-amount-value">{formatCurrency(tx.amount)}</span>
              </td>
              <td className="td-status text-center">
                <StatusBadge status={tx.status} />
              </td>
              <td className="td-actions text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className="btn btn--sm btn--outline"
                  onClick={() => onSelectTransaction(tx)}
                  aria-label={`View details for transaction ${tx.id}`}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
