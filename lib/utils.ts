// Convert ISO date string (YYYY-MM-DD) to short format ("Dec 13")
export function formatShortDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}`;
}

// Determine optimal decimal precision based on currency rate magnitude
// Larger values need fewer decimals, smaller values need more precision
export function getOptimalDecimals(value: number): number {
  if (value >= 100) return 2;
  if (value >= 10) return 3;
  if (value >= 1) return 4;
  if (value >= 0.1) return 5;
  return 6;
}
