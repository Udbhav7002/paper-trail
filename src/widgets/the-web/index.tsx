import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../shared/store/useStore';
import { ReceiptCard } from '../../shared/ui/ReceiptCard';
import { findConnections } from '../../features/connection';
import { ArrowLeft, Link2 } from 'lucide-react';

export const TheWeb = () => {
  // Granular selectors — no re-render on unrelated state changes
  const receipts = useStore((s) => s.receipts);
  const selectedReceiptId = useStore((s) => s.selectedReceiptId);
  const setSelectedReceipt = useStore((s) => s.setSelectedReceipt);

  const targetReceipt = useMemo(
    () => receipts.find((r) => r.id === selectedReceiptId),
    [receipts, selectedReceiptId]
  );

  const connections = useMemo(
    () => (targetReceipt ? findConnections(targetReceipt, receipts) : []),
    [targetReceipt, receipts]
  );

  if (!targetReceipt) {
    return (
      <div className="py-20 text-center font-mono text-gray-600" role="status">
        Select a receipt from Explore or Story to see its connections.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-6xl mx-auto"
    >
      <button
        onClick={() => setSelectedReceipt(null)}
        className="flex items-center gap-2 mb-8 font-mono text-gray-600 hover:text-gray-900 transition-colors uppercase tracking-widest text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 px-2 py-1 min-h-[44px]"
        aria-label="Go back to previous view"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back
      </button>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        {/* Source Receipt */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="bg-gray-900 text-white p-3 font-mono text-xs uppercase tracking-widest text-center">
            Source Receipt
          </div>
          {/* No onClick — this card is display-only; no role=button */}
          <ReceiptCard receipt={targetReceipt} />
        </div>

        {/* Connections */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-dashed border-gray-300 pb-3">
            <h2 className="font-mono text-lg uppercase font-bold tracking-tight">
              Discovered Connections
            </h2>
            <span className="bg-red-100 text-red-800 font-mono text-xs px-3 py-1.5 font-bold" aria-live="polite">
              {connections.length} found
            </span>
          </div>

          {connections.length === 0 ? (
            <p className="font-mono text-gray-600 py-10 text-center" role="status">
              No strong connections found for this moment.
            </p>
          ) : (
            <ul className="flex flex-col gap-6" aria-label="Connected receipts">
              {connections.map((conn, index) => (
                <motion.li
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  key={conn.receipt.id}
                  className="flex flex-col sm:flex-row gap-3 items-start"
                >
                  <div className="hidden sm:flex flex-col items-center pt-8 px-2 shrink-0">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-px h-full bg-gray-300 mt-1 min-h-[40px]" />
                  </div>

                  <div className="flex-1 w-full">
                    <div className="mb-2 inline-flex flex-col gap-1 bg-red-50 border border-red-100 text-red-800 text-xs font-mono px-3 py-1.5">
                      <div className="flex items-center gap-2">
                        <Link2 size={12} aria-hidden="true" />
                        <span>{conn.reason}</span>
                      </div>
                      <div className="mt-1 h-1 bg-gray-200 w-full max-w-[200px]" aria-label={`Connection strength: ${conn.score}`}>
                        <div className="h-full bg-red-500" style={{ width: `${Math.min(conn.score * 10, 100)}%` }} />
                      </div>
                    </div>
                    <ReceiptCard
                      receipt={conn.receipt}
                      onClick={(id) => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedReceipt(id);
                      }}
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};
