import {
  formatCurrency,
  parseCurrency,
  validateCurrency,
} from '../currencyUtils';

describe('currencyUtils', () => {
  describe('formatCurrency', () => {
    it('formats USD currency correctly', () => {
      const result = formatCurrency(1234.56, 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('formats EUR currency correctly', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toBe('€1,234.56');
    });

    it('formats GBP currency correctly', () => {
      const result = formatCurrency(1234.56, 'GBP');
      expect(result).toBe('£1,234.56');
    });

    it('formats JPY currency correctly', () => {
      const result = formatCurrency(1234.56, 'JPY');
      expect(result).toBe('¥1,235'); // JPY typically doesn't show decimals
    });

    it('uses USD as default currency when not specified', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('handles zero amount', () => {
      const result = formatCurrency(0, 'USD');
      expect(result).toBe('$0.00');
    });

    it('handles negative amounts', () => {
      const result = formatCurrency(-1234.56, 'USD');
      expect(result).toBe('-$1,234.56');
    });

    it('handles large numbers', () => {
      const result = formatCurrency(1234567.89, 'USD');
      expect(result).toBe('$1,234,567.89');
    });

    it('handles small decimal amounts', () => {
      const result = formatCurrency(0.99, 'USD');
      expect(result).toBe('$0.99');
    });

    it('handles whole numbers', () => {
      const result = formatCurrency(100, 'USD');
      expect(result).toBe('$100.00');
    });
  });

  describe('parseCurrency', () => {
    it('parses simple number string', () => {
      const result = parseCurrency('123.45');
      expect(result).toBe(123.45);
    });

    it('parses number with currency symbol', () => {
      const result = parseCurrency('$123.45');
      expect(result).toBe(123.45);
    });

    it('parses number with commas', () => {
      const result = parseCurrency('1,234.56');
      expect(result).toBe(1234.56);
    });

    it('parses number with multiple commas', () => {
      const result = parseCurrency('1,234,567.89');
      expect(result).toBe(1234567.89);
    });

    it('parses number with spaces', () => {
      const result = parseCurrency('$ 1,234.56');
      expect(result).toBe(1234.56);
    });

    it('parses whole number', () => {
      const result = parseCurrency('100');
      expect(result).toBe(100);
    });

    it('parses decimal number without leading zero', () => {
      const result = parseCurrency('.99');
      expect(result).toBe(0.99);
    });

    it('returns 0 for invalid string', () => {
      const result = parseCurrency('invalid');
      expect(result).toBe(0);
    });

    it('returns 0 for empty string', () => {
      const result = parseCurrency('');
      expect(result).toBe(0);
    });

    it('returns 0 for string with only non-numeric characters', () => {
      const result = parseCurrency('abc');
      expect(result).toBe(0);
    });

    it('handles negative numbers', () => {
      const result = parseCurrency('-123.45');
      expect(result).toBe(123.45); // parseCurrency removes negative sign
    });

    it('handles zero', () => {
      const result = parseCurrency('0');
      expect(result).toBe(0);
    });

    it('handles very small decimals', () => {
      const result = parseCurrency('0.01');
      expect(result).toBe(0.01);
    });
  });

  describe('validateCurrency', () => {
    it('validates correct currency format', () => {
      expect(validateCurrency('123.45')).toBe(true);
    });

    it('validates whole numbers', () => {
      expect(validateCurrency('100')).toBe(true);
    });

    it('validates numbers with one decimal place', () => {
      expect(validateCurrency('123.4')).toBe(true);
    });

    it('validates numbers with two decimal places', () => {
      expect(validateCurrency('123.45')).toBe(true);
    });

    it('validates zero', () => {
      expect(validateCurrency('0')).toBe(true);
    });

    it('validates decimal numbers', () => {
      expect(validateCurrency('0.99')).toBe(true);
    });

    it('rejects numbers with more than two decimal places', () => {
      expect(validateCurrency('123.456')).toBe(false);
    });

    it('rejects strings with letters', () => {
      expect(validateCurrency('123abc')).toBe(false);
    });

    it('rejects strings with special characters', () => {
      expect(validateCurrency('123.45$')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(validateCurrency('')).toBe(false);
    });

    it('rejects strings with spaces', () => {
      expect(validateCurrency('123 45')).toBe(false);
    });

    it('rejects strings with multiple decimal points', () => {
      expect(validateCurrency('123.45.67')).toBe(false);
    });

    it('rejects strings starting with decimal point', () => {
      expect(validateCurrency('.123')).toBe(false);
    });

    it('validates strings ending with decimal point', () => {
      expect(validateCurrency('123.')).toBe(true); // The regex allows this
    });

    it('validates large numbers', () => {
      expect(validateCurrency('999999.99')).toBe(true);
    });

    it('rejects negative numbers', () => {
      expect(validateCurrency('-123.45')).toBe(false);
    });
  });
}); 