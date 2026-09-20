import { create } from 'zustand';
import type { Receipt, ReceiptType, DataInsights } from '../../entities/receipt-model';
import { computeInsights } from '../../features/insights';

interface FilterState {
  search: string;
  type: ReceiptType | 'all';
}

/**
 * Represents the current active view mode within the application.
 */
export type ViewMode = 'explore' | 'connect' | 'story' | 'insights';

/**
 * The primary application state interface managing receipts, filters, and view modes.
 */
interface AppState {
  receipts: Receipt[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  activeView: ViewMode;
  previousView: ViewMode;
  selectedReceiptId: string | null;
  insights: DataInsights | null;
  viewedReceiptIds: Record<string, true>;
  /** Updates the active search term for filtering receipts. */
  setSearch: (term: string) => void;
  /** Sets the active category filter chip. */
  setType: (type: ReceiptType | 'all') => void;
  /** Switches the active view, tracking the previous view for Back navigation. */
  setView: (view: ViewMode) => void;
  /** Selects a receipt for relationship discovery, or clears selection to return back. */
  setSelectedReceipt: (id: string | null) => void;
  /** Asynchronously loads normalized receipt records and computes cached insights. */
  loadData: () => Promise<void>;
}

export const useStore = create<AppState>((set) => ({
  receipts: [],
  isLoading: true,
  error: null,
  filters: { search: '', type: 'all' },
  activeView: 'explore',
  previousView: 'explore',
  selectedReceiptId: null,
  insights: null,
  viewedReceiptIds: {},

  /** Switches the active view, tracking the previous view for Back navigation. */
  setView: (view) => set((s) => ({ activeView: view, previousView: s.activeView })),

  /** Selects a receipt for relationship discovery, or clears selection to return back. */
  setSelectedReceipt: (id) => {
    if (id) {
      set((state) => ({
        selectedReceiptId: id,
        previousView: state.activeView !== 'connect' ? state.activeView : state.previousView,
        activeView: 'connect',
        viewedReceiptIds: { ...state.viewedReceiptIds, [id]: true },
      }));
    } else {
      // Return to the view the user came from, not always 'explore'
      set((state) => ({ selectedReceiptId: null, activeView: state.previousView }));
    }
  },

  /** Asynchronously loads normalized receipt records and computes cached insights. */
  loadData: async () => {
    try {
      const module = await import('../../data/receipts.json');
      const data = module.default as Receipt[];
      const insights = computeInsights(data);
      set({ receipts: data, insights, isLoading: false, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error occurred';
      console.error('Failed to load receipts', e);
      set({ isLoading: false, error: msg });
    }
  },

  /** Updates the active search term for filtering receipts. */
  setSearch: (term) => set((s) => ({ filters: { ...s.filters, search: term } })),
  /** Sets the active category filter chip. */
  setType: (type) => set((s) => ({ filters: { ...s.filters, type } })),
}));
