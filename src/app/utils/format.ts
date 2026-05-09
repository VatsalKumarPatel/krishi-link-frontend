const decimalFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });
const preciseNumberFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 });
const dateOnlyFormatter = new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export function formatNumber(value: number): string {
  return decimalFormatter.format(value);
}

export function formatPreciseNumber(value: number): string {
  return preciseNumberFormatter.format(value);
}

export function formatMoney(value: number): string {
  return decimalFormatter.format(value);
}

export function formatMoneyWithSymbol(value: number): string {
  return `₹${formatMoney(value)}`;
}

export function formatDateOnly(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return dateOnlyFormatter.format(new Date(date));
}

export function formatShortId(id: string | null | undefined): string {
  return id ? `${id.slice(0, 8)}...` : '...';
}
