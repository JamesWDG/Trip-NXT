/** Display ride fares in USD. Backend stores amounts in PKR (Rs). */
export const RS_PER_USD = 280;

export function formatUsd(amountInRs: number): string {
  if (!Number.isFinite(amountInRs)) return '$0.00';
  const usd = amountInRs / RS_PER_USD;
  return `$${usd.toFixed(2)}`;
}
