import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('Transactions Dashboard Integration', () => {
  it('renders initial loading state then displays summary cards and transactions table', async () => {
    render(<App />);

    // Check app header
    expect(screen.getByText('Transactions Dashboard')).toBeInTheDocument();

    // Wait for data to load and transaction row to appear
    const firstTx = await screen.findByText('TXN-90141');
    expect(firstTx).toBeInTheDocument();

    // Verify summary metric cards
    expect(screen.getByTestId('metric-total-count')).toBeInTheDocument();
    expect(screen.getByTestId('metric-completed-count')).toBeInTheDocument();
    expect(screen.getByTestId('metric-total-value')).toBeInTheDocument();

    // Verify presence of table headers
    expect(screen.getByRole('columnheader', { name: /Transaction ID/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Description/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /Status/i })).toBeInTheDocument();
  });

  it('filters transactions dynamically by search query', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    const searchInput = screen.getByPlaceholderText(/Search description or ID/i);
    await user.type(searchInput, 'Figma');

    // Should display Figma transaction
    expect(await screen.findByText('Figma Organization Annual Subscription')).toBeInTheDocument();

    // Should NOT display AWS transaction
    expect(screen.queryByText('AWS Cloud Infrastructure - US East Cluster')).not.toBeInTheDocument();
  });

  it('filters transactions by status', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    const statusSelect = screen.getByLabelText(/Filter by transaction status/i);
    await user.selectOptions(statusSelect, 'Pending');

    // Should show Hilton (Pending)
    expect(await screen.findByText(/Hilton Union Square SF/i)).toBeInTheDocument();
    // Should NOT show AWS (Completed)
    expect(screen.queryByText(/AWS Cloud Infrastructure/i)).not.toBeInTheDocument();
  });

  it('filters transactions by category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    const categorySelect = screen.getByLabelText(/Filter by transaction category/i);
    await user.selectOptions(categorySelect, 'Payroll');

    expect(await screen.findByText(/Gusto Bi-Weekly Payroll Processing/i)).toBeInTheDocument();
    expect(screen.queryByText(/AWS Cloud Infrastructure/i)).not.toBeInTheDocument();
  });

  it('displays no-results state and resets filters properly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    const searchInput = screen.getByPlaceholderText(/Search description or ID/i);
    await user.type(searchInput, 'XYZNonExistentKeyword999');

    expect(await screen.findByText('No Matching Transactions Found')).toBeInTheDocument();

    // Click Reset Filters
    const resetButtons = screen.getAllByRole('button', { name: /Reset.*Filter/i });
    await user.click(resetButtons[0]);

    // AWS should reappear
    expect(await screen.findByText('TXN-90141')).toBeInTheDocument();
  });

  it('opens transaction details modal on row click and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    // Click on row
    const row = screen.getByTestId('transaction-row-TXN-90141');
    await user.click(row);

    // Modal dialog should appear
    const dialog = screen.getByRole('dialog', { name: /TXN-90141/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByTestId('modal-amount')).toHaveTextContent('$1,420.50');
    expect(screen.getByTestId('modal-desc')).toHaveTextContent('AWS Cloud Infrastructure - US East Cluster');

    // Close with Escape key
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('sorts by amount when amount header button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText('TXN-90141');

    // Click Amount sort button in table header
    const amountSortBtn = screen.getByRole('button', { name: /Sort by Amount/i });
    await user.click(amountSortBtn);

    // Gusto Payroll is $18,450.00 (highest amount in mock data)
    expect(await screen.findByText('Gusto Bi-Weekly Payroll Processing')).toBeInTheDocument();
  });
});
