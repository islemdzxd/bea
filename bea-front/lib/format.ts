/**
 * Format a number with thousand separators without locale dependency
 * Avoids hydration mismatch errors by using consistent formatting
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format currency without locale dependency
 */
export function formatCurrency(num: number, symbol = '$'): string {
  return `${symbol}${formatNumber(Math.abs(num))}`;
}
