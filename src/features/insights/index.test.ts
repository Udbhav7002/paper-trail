import { describe, it, expect } from 'vitest';
import { computeInsights } from './index';
import type { Receipt } from '../../entities/receipt-model';

const make = (over: Partial<Receipt>): Receipt => ({
  id: 'x',
  type: 'music',
  title: 't',
  description: 'd',
  timestamp: '2018-09-01T10:00:00',
  tags: ['music'],
  metadata: {},
  ...over,
});

describe('computeInsights', () => {
  it('counts total receipts', () => {
    const receipts = [make({ id: '1' }), make({ id: '2' }), make({ id: '3' })];
    const result = computeInsights(receipts);
    expect(result.totalReceipts).toBe(3);
  });

  it('finds top artist from music receipts', () => {
    const receipts = [
      make({ id: '1', type: 'music', metadata: { artist: 'Radiohead' } }),
      make({ id: '2', type: 'music', metadata: { artist: 'Radiohead' } }),
      make({ id: '3', type: 'music', metadata: { artist: 'Coldplay' } }),
    ];
    const result = computeInsights(receipts);
    expect(result.topArtist?.name).toBe('Radiohead');
    expect(result.topArtist?.count).toBe(2);
  });

  it('counts late-night activities (midnight to 6 AM)', () => {
    const receipts = [
      make({ id: '1', timestamp: '2018-09-01T02:00:00' }), // 2 AM — late night
      make({ id: '2', timestamp: '2018-09-01T05:30:00' }), // 5:30 AM — late night
      make({ id: '3', timestamp: '2018-09-01T10:00:00' }), // 10 AM — not late night
    ];
    const result = computeInsights(receipts);
    expect(result.lateNightCount).toBe(2);
  });

  it('does not count undefined category from purchase with single tag', () => {
    const receipts = [
      make({ id: '1', type: 'purchase', tags: ['purchase'] }), // no second tag
    ];
    const result = computeInsights(receipts);
    // topCategory should be null, not "undefined"
    expect(result.topCategory).toBeNull();
  });

  it('identifies most active day', () => {
    const receipts = [
      make({ id: '1', timestamp: '2018-09-01T10:00:00' }),
      make({ id: '2', timestamp: '2018-09-01T14:00:00' }),
      make({ id: '3', timestamp: '2018-09-02T10:00:00' }),
    ];
    const result = computeInsights(receipts);
    expect(result.mostActiveDay?.date).toBe('2018-09-01');
    expect(result.mostActiveDay?.count).toBe(2);
  });

  it('returns correct type distribution', () => {
    const receipts = [
      make({ id: '1', type: 'music' }),
      make({ id: '2', type: 'music' }),
      make({ id: '3', type: 'purchase' }),
    ];
    const result = computeInsights(receipts);
    expect(result.receiptsByType['music']).toBe(2);
    expect(result.receiptsByType['purchase']).toBe(1);
  });

  it('sums spending amounts', () => {
    const receipts = [
      make({ id: '1', type: 'purchase', metadata: { amount: 100 } }),
      make({ id: '2', type: 'purchase', metadata: { amount: 250.4 } }),
    ];
    expect(computeInsights(receipts).totalSpent).toBe(350);
  });
});
