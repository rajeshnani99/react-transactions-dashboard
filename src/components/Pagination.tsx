import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="pagination-bar" aria-label="Pagination controls">
      <div className="pagination-left">
        <span className="pagination-range-text">
          Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{' '}
          <strong>{totalItems}</strong> transactions
        </span>

        <div className="page-size-selector">
          <label htmlFor="page-size-select" className="page-size-label">
            Rows per page:
          </label>
          <select
            id="page-size-select"
            className="select page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Select number of transactions per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <nav className="pagination-controls" aria-label="Pagination Navigation">
        <button
          type="button"
          className="btn btn--page-nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Go to previous page"
        >
          ‹ Prev
        </button>

        <div className="pagination-numbers">
          {getPageNumbers().map((page, index) => {
            if (typeof page === 'string') {
              return (
                <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                  {page}
                </span>
              );
            }

            const isActive = page === currentPage;
            return (
              <button
                key={page}
                type="button"
                className={`btn btn--page-num ${isActive ? 'btn--page-num-active' : ''}`}
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${page}${isActive ? ', current page' : ''}`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="btn btn--page-nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Go to next page"
        >
          Next ›
        </button>
      </nav>
    </div>
  );
};
