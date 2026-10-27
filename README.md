# React Transactions Dashboard

A modern, responsive, and accessible enterprise financial transactions dashboard built with **React 18**, **TypeScript**, and **Vite**, tested using **Vitest** and **React Testing Library**.

---

## Quick Start

### Prerequisites
- Node.js `^18.20.0` or `>=20.0.0`
- npm `>=10.0.0`

### Installation
```bash
# Navigate to project directory
cd react-transactions-dashboard

# Install dependencies
npm install
```

### Run Locally (Development)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Run Tests
```bash
# Run unit & integration test suites once
npm run test

# Run tests in interactive watch mode
npm run test:watch
```

### Production Build
```bash
# Typecheck with tsc and build production bundle with Vite
npm run build

# Preview production build locally
npm run preview
```

---

## Connecting Your Real API

A dedicated API client service layer is provided in `src/services/transactionsApi.ts`.

### How to use your real API:
Open `.env` (or copy `.env.example` to `.env`) and provide your API URL:
```env
VITE_API_URL=https://api.yourdomain.com/v1/transactions
```

### Supported API Response Formats
The client automatically normalizes data whether your API returns:
1. **Direct JSON Array**:
   ```json
   [
     {
       "id": "TXN-101",
       "description": "AWS Cloud Services",
       "amount": 1250.50,
       "date": "2026-10-24T12:00:00Z",
       "category": "Technology",
       "status": "Completed"
     }
   ]
   ```
2. **Wrapped Object** (e.g., `{ "data": [...] }`, `{ "transactions": [...] }`, or `{ "results": [...] }`).
3. **Flexible Field Names**:
   Automatically maps `_id` / `transactionId` -> `id`, `title` / `name` -> `description`, and parses string numbers like `"1250.50"` safely.

> If `VITE_API_URL` is empty, the application automatically runs in **Mock Mode** with 32 realistic corporate transactions.
```

---

## Features Implemented

1. **Responsive Transactions Table**:
   - Detailed financial tabular view with Transaction ID, Description, Amount, Date, Category, Status badge, and View Details action.
   - Clean horizontal scrolling on narrow screens with sticky headers.

2. **Search Capabilities**:
   - Instant search matching both description and transaction ID (case-insensitive substring match).
   - Clear query button (`✕`) for rapid search clearing.

3. **Status & Category Filtering**:
   - Filter by status: `All Statuses`, `Completed`, `Pending`, `Failed`.
   - Filter by category: `All Categories`, `Technology`, `Office Supplies`, `Travel & Entertainment`, `Marketing`, `Utilities`, `Payroll`, `Legal & Professional`, `Healthcare`.

4. **Multi-Column Sorting**:
   - Sort by Date (newest or oldest) and Amount (highest or lowest).
   - Interactive table header buttons with visual indicators (`▲`, `▼`, `↕`).
   - Accessible `aria-sort` indicators.

5. **Configurable Pagination**:
   - Configurable page size dropdown (5, 10, 20, 50 rows per page).
   - Real-time range indicator: `"Showing 1 - 10 of 32 transactions"`.
   - Page navigation buttons with previous/next controls, page numbers, and ellipsis.
   - Automatic reset to page 1 whenever filters or search query change.

6. **Transaction Details View (Modal)**:
   - Clicking any transaction row or "View Details" opens an accessible modal dialog (`role="dialog"`, `aria-modal="true"`).
   - Displays extended attributes: Transaction ID, status badge, formatted amount, category, localized date & time, merchant name, payment method, reference number, and audit notes.
   - Dismissible via `Escape` key, backdrop click, or close button with proper keyboard focus.

7. **Comprehensive System States**:
   - **Loading State**: Animated skeleton cards and table placeholder during asynchronous fetching.
   - **Error State**: Illustrative error message with a direct "Retry Request" trigger.
   - **Empty State**: Friendly messaging when an account has zero transactions recorded.
   - **No Search Results State**: Clear feedback when filters or search produce zero matches with a single-click "Reset All Filters" button.
   - **Simulation Controls**: Top-bar "Refresh" and "Simulate Error" buttons allowing hackathon evaluators to test network failure and retry transitions instantly.

8. **Summary Statistics Cards**:
   - Total Transactions count with pending/failed sub-breakdown.
   - Completed Transactions count with percentage completion rate badge.
   - Total Transaction Value with formatted currency and settled volume breakdown.

9. **Reset All Filters Button**:
   - Reset button highlights dynamically when any filter, search query, or non-default sort is active, restoring default view on click.

10. **A11y (Accessibility) & Defensive Design**:
    - Semantic HTML elements (`<header>`, `<main>`, `<section>`, `<table>`, `<th>`, `<td>`, `<nav>`).
    - Explicit ARIA attributes (`aria-label`, `aria-sort`, `role="status"`, `role="dialog"`, `role="search"`).
    - Visible focus rings (`:focus-visible`) for keyboard navigation.
    - Defensive formatters that safely handle `null`, `undefined`, `NaN`, and malformed date strings.

---

## Folder Structure

```
react-transactions-dashboard/
├── index.html                   # HTML entry point with metadata & viewport
├── package.json                 # Scripts, dependencies, and testing config
├── tsconfig.json                # Root TS configuration
├── tsconfig.app.json            # Application TS compiler options
├── tsconfig.node.json           # Vite node configuration
├── vite.config.ts               # Vite & Vitest configuration
├── public/                      # Static assets
└── src/
    ├── main.tsx                 # React DOM mount point with StrictMode
    ├── App.tsx                  # Main layout orchestrating dashboard components
    ├── index.css                # Unified CSS design system & responsive styling
    ├── App.css                  # App-level overrides
    ├── types/
    │   └── transaction.ts       # Strict TypeScript interfaces & union types
    ├── data/
    │   └── mockTransactions.ts  # 32 realistic corporate transactions
    ├── utils/
    │   ├── formatters.ts        # Defensive currency, date, and status formatters
    │   └── filterAndSort.ts     # Pure business logic (filter, sort, paginate, metrics)
    ├── hooks/
    │   └── useTransactions.ts   # Custom hook managing state & async lifecycle
    ├── components/
    │   ├── Header.tsx           # Brand header, live status indicator & simulation actions
    │   ├── SummaryCards.tsx     # 3 primary metric cards + skeleton states
    │   ├── FilterBar.tsx        # Search input, dropdown filters, sort controls, reset
    │   ├── TransactionsTable.tsx# Accessible sortable table with clickable rows
    │   ├── StatusBadge.tsx      # Color-coded status badge component
    │   ├── Pagination.tsx       # Range indicator, page size selector & page buttons
    │   ├── TransactionModal.tsx # Accessible details modal with keyboard listener
    │   └── StateView.tsx        # Loading skeleton, Error, Empty, and No Results views
    └── test/
        ├── setup.ts             # Vitest test setup with @testing-library/jest-dom
        ├── formatters.test.ts   # Unit tests for currency & date edge cases
        ├── filterAndSort.test.ts# Pure logic tests for search, filter, sort, pagination
        └── TransactionsDashboard.test.tsx # RTL integration tests for user workflows
```

---

## Architectural & Implementation Decisions

1. **Pure Utility Functions for Business Logic (`filterAndSort.ts`)**:
   - Decoupled filtering, sorting, pagination, and metric computation from React lifecycle.
   - Enables fast, isolated unit testing without DOM overhead and makes logic easy to modify or migrate to backend/API query params if needed.

2. **Custom Hook as a State Container (`useTransactions.ts`)**:
   - Keeps `App.tsx` concise and declarative.
   - Encapsulates simulated async network delay (450ms) and error simulation toggles.
   - Prevents stale pagination bugs by resetting `currentPage` back to 1 whenever any filter or search query changes.
   - Utilizes `useMemo` for filtered/sorted subsets to avoid recalculations on unrelated state updates.

3. **Defensive Formatting (`formatters.ts`)**:
   - Financial dashboards must never crash on bad data. All currency and date formatters handle `NaN`, `null`, `undefined`, and invalid ISO dates gracefully with sensible fallbacks (`$0.00`, `N/A`).

4. **Zero Heavy External Dependencies**:
   - Built strictly with React, TypeScript, and Vite.
   - Avoided heavy UI component libraries or CSS-in-JS runtimes to ensure instant load time, small bundle footprint (~55 kB gzipped), and clean maintainability in a timed hackathon environment.

5. **Accessibility-First Interactions**:
   - Table rows are keyboard navigable (`Tab`, `Enter`, `Space`).
   - Modal supports `Escape` key dismissal and backdrop click dismissal.
   - Native `<select>` and `<input>` elements retain native platform accessibility and screen-reader support.

---

## Testing Verification

Run the test suite with:
```bash
npm run test
```

### Test Results
- **`src/test/formatters.test.ts`**: 8 passed (currency, date, edge cases, NaN/null guards)
- **`src/test/filterAndSort.test.ts`**: 17 passed (search, filter combinations, sorting, pagination slices, clamp bounds, metric aggregations)
- **`src/test/TransactionsDashboard.test.tsx`**: 7 passed (RTL integration testing search filtering, category/status selection, reset filter, modal open/close, column sorting)

**Total**: 32 tests passing across 3 test suites.
