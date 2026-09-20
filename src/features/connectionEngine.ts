import type { Receipt } from '../entities/receipt';

export interface Connection {
  receipt: Receipt;
  reason: string;
  score: number;
}

export function findConnections(target: Receipt, allReceipts: Receipt[]): Connection[] {
  const connections: Connection[] = [];
  const targetDate = target.timestamp.split('T')[0];

  for (const r of allReceipts) {
    if (r.id === target.id) continue;

    let score = 0;
    const reasons: string[] = [];
    const rDate = r.timestamp.split('T')[0];

    // Same day connection
    if (targetDate === rDate) {
      score += 3;
      reasons.push('Happened on the exact same day');
    }

    // Keyword overlap in tags
    const sharedTags = target.tags.filter(t => r.tags.includes(t) && t !== target.type && t !== r.type);
    if (sharedTags.length > 0) {
      score += sharedTags.length * 2;
      reasons.push(`Shared keyword: ${sharedTags[0]}`);
    }

    // Location match
    if (target.location && r.location && target.location !== 'Unknown' && target.location === r.location) {
      score += 4;
      reasons.push('Happened at the same location');
    }

    // Time gap connection (if within 2 hours on different days, maybe similar routine)
    // To keep it fast, we only do strong connections.

    if (score > 0) {
      connections.push({
        receipt: r,
        reason: reasons.join(' • '),
        score
      });
    }
  }

  // Sort by score descending and return top 10
  return connections.sort((a, b) => b.score - a.score).slice(0, 10);
}
