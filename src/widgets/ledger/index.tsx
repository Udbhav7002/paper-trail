import { useState, useMemo } from 'react';
import { useStore } from '../../shared/store/useStore';
import { ReceiptCard } from '../../shared/ui/ReceiptCard';
import { Search, Filter } from 'lucide-react';
import type { ReceiptType } from '../../entities/receipt-model';

const TYPES: { value: ReceiptType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'music', label: 'Music' },
  { value: 'purchase', label: 'Purchase' },
  { value: 'message', label: 'Message' },
  { value: 'search', label: 'Search' },
  { value: 'note', label: 'Note' },
];

export const Ledger = () => {
  const filters = useStore((s) => s.filters);
  const setSearch = useStore((s) => s.setSearch);
  const setType = useStore((s) => s.setType);
  const isLoading = useStore((s) => s.isLoading);
  const setSelectedReceipt = useStore((s) => s.setSelectedReceipt);
  const receipts = useStore((s) => s.receipts);

  const [visibleCount, setVisibleCount] = useState(50);

  const [sort, setSort] = useState<'newest' | 'oldest' | 'title'>('newest');

  const filteredReceipts = useMemo(() => {
    const filtered = receipts.filter((r) => {
      const matchType = filters.type === 'all' || r.type === filters.type;
      const matchSearch =
        filters.search === '' ||
        r.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        r.description.toLowerCase().includes(filters.search.toLowerCase());
      return matchType && matchSearch;
    });

    const sorted = filtered.slice();
    if (sort === 'newest') sorted.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    if (sort === 'oldest') sorted.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [receipts, filters, sort]);

  const visibleReceipts = useMemo(
    () => filteredReceipts.slice(0, visibleCount),
    [filteredReceipts, visibleCount]
  );

  if (isLoading) {
    return (
      <div className="py-20 text-center font-mono text-gray-600 animate-pulse" role="status">
        <span>Loading receipts…</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col h-full">
      {/* Sticky Filter Bar */}
      <section
        className="sticky top-0 z-10 bg-[#f4f1ea]/95 backdrop-blur-md pb-5 pt-4 border-b border-gray-300 border-dashed mb-8"
        aria-label="Filter controls"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-600" size={18} aria-hidden="true" />
            </div>
            <input
              id="receipt-search"
              type="search"
              placeholder="Search receipts…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 font-mono text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
              value={filters.search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(50);
              }}
              aria-label="Search receipts by title or description"
            />
          </div>

          <div
            className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar"
            role="group"
            aria-label="Filter by receipt type"
          >
            <Filter className="text-gray-600 mr-1 shrink-0" size={16} aria-hidden="true" />
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => {
                  setType(t.value);
                  setVisibleCount(50);
                }}
                aria-pressed={filters.type === t.value}
                className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider whitespace-nowrap border-2 transition-colors min-h-[36px] ${
                  filters.type === t.value
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'
                }`}
              >
                {t.label}
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sort receipts"
              className="px-2 py-1.5 font-mono text-xs uppercase bg-white border-2 border-gray-300 min-h-[36px] ml-2 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">A–Z</option>
            </select>
          </div>
        </div>

        <p className="font-mono text-xs text-gray-600 mt-3" aria-live="polite">
          Showing {visibleReceipts.length} of {filteredReceipts.length} entries
        </p>
      </section>

      {/* Receipt Grid */}
      <section
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-20"
        aria-label="Receipt list"
      >
        {visibleReceipts.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            onClick={(id) => setSelectedReceipt(id)}
          />
        ))}
      </section>

      {/* Load More */}
      {visibleCount < filteredReceipts.length && (
        <div className="py-10 flex justify-center">
          <button
            onClick={() => setVisibleCount((v) => v + 50)}
            className="px-8 py-3 bg-gray-900 text-white font-mono text-sm uppercase tracking-widest hover:bg-red-600 transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-gray-300 min-h-[44px]"
            aria-label={`Load 50 more receipts. Currently showing ${visibleReceipts.length} of ${filteredReceipts.length}`}
          >
            Load More Receipts
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredReceipts.length === 0 && (
        <div className="py-20 text-center font-mono text-gray-600" role="status">
          No receipts found matching your criteria.
        </div>
      )}
    </div>
  );
};
