import { describe, it, expect } from 'vitest';
import { findConnections } from './index';
import type { Receipt } from '../../entities/receipt-model';

const make = (over: Partial<Receipt>): Receipt => ({
  id: 'x',
  type: 'music',
  title: 't',
  description: 'd',
  timestamp: '2018-09-01T10:00:00',
  tags: [],
  metadata: {},
  ...over,
});

describe('findConnections', () => {
  it('links same-day receipts', () => {
    const target = make({ id: '1', timestamp: '2018-09-01T22:00:00' });
    const sameDay = make({ id: '2', timestamp: '2018-09-01T23:00:00' });
    const otherDay = make({ id: '3', timestamp: '2018-09-02T22:00:00' });
    const result = findConnections(target, [target, sameDay, otherDay]);
    expect(result.map((c) => c.receipt.id)).toContain('2');
    expect(result.map((c) => c.receipt.id)).not.toContain('3');
  });

  it('excludes the target receipt itself', () => {
    const target = make({ id: '1', tags: ['a'] });
    const result = findConnections(target, [target, make({ id: '2', tags: ['a'] })]);
    expect(result.every((c) => c.receipt.id !== '1')).toBe(true);
  });

  it('ranks location matches above same-day-only links', () => {
    const target = make({ id: '1', timestamp: '2018-09-01T10:00:00', location: 'Cafe X' });
    const loc = make({ id: '2', timestamp: '2018-09-03T10:00:00', location: 'Cafe X' });
    const day = make({ id: '3', timestamp: '2018-09-01T15:00:00' });
    const result = findConnections(target, [target, loc, day]);
    expect(result[0].receipt.id).toBe('2');
  });

  it('links receipts sharing non-type tags', () => {
    // Put each receipt on a different day so same-day scoring doesn't interfere
    const target = make({ id: '1', type: 'purchase', tags: ['purchase', 'transit'], timestamp: '2018-09-01T10:00:00' });
    const sharedTag = make({ id: '2', type: 'music', tags: ['music', 'transit'], timestamp: '2018-09-05T10:00:00' });
    const noTag = make({ id: '3', type: 'note', tags: ['note', 'food'], timestamp: '2018-09-10T10:00:00' });
    const result = findConnections(target, [target, sharedTag, noTag]);
    expect(result.map((c) => c.receipt.id)).toContain('2');
    expect(result.map((c) => c.receipt.id)).not.toContain('3');
  });

  it('returns at most 10 connections', () => {
    const target = make({ id: 'target', timestamp: '2018-09-01T10:00:00' });
    const others = Array.from({ length: 20 }, (_, i) =>
      make({ id: `r${i}`, timestamp: '2018-09-01T11:00:00' })
    );
    const result = findConnections(target, [target, ...others]);
    expect(result.length).toBeLessThanOrEqual(10);
  });
});
