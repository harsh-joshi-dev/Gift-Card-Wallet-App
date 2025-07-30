/**
 * Format a number as currency using the browser's Intl API
 * @param amount - The amount to format
 * @param currency - The currency code (defaults to USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Parse a currency string back to a number
 * Removes all non-numeric characters except decimal point
 * @param value - The currency string to parse
 * @returns Parsed number or 0 if invalid
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate if a string represents a valid currency amount
 * Allows up to 2 decimal places
 * @param value - The string to validate
 * @returns True if valid currency format
 */
export const validateCurrency = (value: string): boolean => {
  const regex = /^\d+(\.\d{0,2})?$/;
  return regex.test(value);
}; 