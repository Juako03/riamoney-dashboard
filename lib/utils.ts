export function formatShortDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}`;
}

export function getOptimalDecimals(value: number): number {
  if (value >= 100) return 2;
  if (value >= 10) return 3;
  if (value >= 1) return 4;
  if (value >= 0.1) return 5;
  return 6;
}
