import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, getStatusAriaLabel } from '../utils/formatters';

describe('formatters utility', () => {
  describe('formatCurrency', () => {
    it('formats positive numbers to USD currency', () => {
      expect(formatCurrency(1250.5)).toBe('$1,250.50');
      expect(formatCurrency(540)).toBe('$540.00');
      expect(formatCurrency(0)).toBe('$0.00');
    });

    it('safely handles null, undefined, or NaN values', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
    });

    it('formats fractional cents correctly', () => {
      expect(formatCurrency(99.999)).toBe('$100.00');
      expect(formatCurrency(14.2)).toBe('$14.20');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings without time', () => {
      const formatted = formatDate('2026-10-26T14:30:00Z');
      expect(formatted).toMatch(/Oct 26, 2026/);
    });

    it('formats ISO date strings with time when requested', () => {
      const formatted = formatDate('2026-10-26T14:30:00Z', true);
      expect(formatted).toMatch(/Oct 26, 2026/);
      expect(formatted).toMatch(/:/); // contains hour/minute
    });

    it('handles null, undefined, or empty date strings safely', () => {
      expect(formatDate(null)).toBe('N/A');
      expect(formatDate(undefined)).toBe('N/A');
      expect(formatDate('')).toBe('N/A');
    });

    it('handles invalid date strings defensively', () => {
      expect(formatDate('not-a-date')).toBe('Invalid Date');
    });
  });

  describe('getStatusAriaLabel', () => {
    it('returns descriptive accessibility labels for each status', () => {
      expect(getStatusAriaLabel('Completed')).toContain('Completed');
      expect(getStatusAriaLabel('Pending')).toContain('Pending');
      expect(getStatusAriaLabel('Failed')).toContain('Failed');
    });
  });
});
