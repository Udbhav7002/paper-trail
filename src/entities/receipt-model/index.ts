export type ReceiptType = 'music' | 'purchase' | 'note' | 'message' | 'search';

export interface Receipt {
  id: string;
  type: ReceiptType;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  tags: string[];
  metadata: Record<string, unknown>;
}

/** Derived stats computed once from the full dataset */
export interface DataInsights {
  totalReceipts: number;
  topArtist: { name: string; count: number } | null;
  topCategory: { name: string; count: number } | null;
  totalSpent: number;
  dateRange: { start: string; end: string };
  receiptsByType: Record<string, number>;
  mostActiveDay: { date: string; count: number } | null;
  lateNightCount: number;
}
