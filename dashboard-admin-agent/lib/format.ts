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

export function formatDate(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : `${iso}T12:00:00`);
  return d.toLocaleDateString('fr-DZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('fr-DZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatAmountDzd(num: number): string {
  return `${formatNumber(num)} DZD`;
}

export function formatAmountEur(num: number): string {
  return `${formatNumber(num)} EUR`;
}
