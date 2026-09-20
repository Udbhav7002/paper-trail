import type { Receipt, DataInsights } from '../../entities/receipt-model';

/**
 * Computes aggregate insights from the full receipt dataset.
 * Runs once on data load. Pure function, no side effects.
 *
 * @param receipts - The complete array of parsed receipts.
 * @returns A structured DataInsights object containing analytics like top artist, total spent, and late night metrics.
 */
export function computeInsights(receipts: Receipt[]): DataInsights {
  const receiptsByType: Record<string, number> = {};
  const artistCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};
  let totalSpent = 0;
  let lateNightCount = 0;

  for (const r of receipts) {
    // Type distribution
    receiptsByType[r.type] = (receiptsByType[r.type] || 0) + 1;

    // Day counts
    const day = r.timestamp.split('T')[0];
    dayCounts[day] = (dayCounts[day] || 0) + 1;

    // Late night (between 00:00 and 05:59)
    const hour = new Date(r.timestamp).getHours();
    if (hour >= 0 && hour < 6) lateNightCount++;

    // Artist counts (music type)
    if (r.type === 'music' && r.metadata.artist) {
      const artist = String(r.metadata.artist);
      artistCounts[artist] = (artistCounts[artist] || 0) + 1;
    }

    // Category counts (purchase type)
    if (r.type === 'purchase' && r.tags[1]) {
      const cat = r.tags[1]; // First tag after 'purchase'
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }

    // Spending
    if (r.metadata.amount) {
      totalSpent += Number(r.metadata.amount) || 0;
    }
  }

  // Find top artist
  let topArtist: DataInsights['topArtist'] = null;
  for (const [name, count] of Object.entries(artistCounts)) {
    if (!topArtist || count > topArtist.count) topArtist = { name, count };
  }

  // Find top category
  let topCategory: DataInsights['topCategory'] = null;
  for (const [name, count] of Object.entries(categoryCounts)) {
    if (!topCategory || count > topCategory.count) topCategory = { name, count };
  }

  // Find most active day
  let mostActiveDay: DataInsights['mostActiveDay'] = null;
  for (const [date, count] of Object.entries(dayCounts)) {
    if (!mostActiveDay || count > mostActiveDay.count) mostActiveDay = { date, count };
  }

  // Date range
  const timestamps = receipts.map(r => r.timestamp).sort();
  const dateRange = {
    start: timestamps[0] || '',
    end: timestamps[timestamps.length - 1] || '',
  };

  return {
    totalReceipts: receipts.length,
    topArtist,
    topCategory,
    totalSpent: Math.round(totalSpent),
    dateRange,
    receiptsByType,
    mostActiveDay,
    lateNightCount,
  };
}
