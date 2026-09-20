import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { useStore } from '../../shared/store/useStore';
import { LayoutGrid, Network, BookOpen, BarChart3, Fingerprint } from 'lucide-react';
import type { ViewMode } from '../../shared/store/useStore';

const Ledger = lazy(() => import('../../widgets/ledger').then((m) => ({ default: m.Ledger })));
const TheWeb = lazy(() => import('../../widgets/the-web').then((m) => ({ default: m.TheWeb })));
const TheThread = lazy(() => import('../../widgets/the-thread').then((m) => ({ default: m.TheThread })));
const InsightsDashboard = lazy(() => import('../../widgets/insights-dashboard').then((m) => ({ default: m.InsightsDashboard })));

const NAV_ITEMS: { view: ViewMode; icon: typeof LayoutGrid; label: string; alwaysEnabled: boolean }[] = [
  { view: 'explore', icon: LayoutGrid, label: 'Explore', alwaysEnabled: true },
  { view: 'story', icon: BookOpen, label: 'Story', alwaysEnabled: true },
  { view: 'insights', icon: BarChart3, label: 'Insights', alwaysEnabled: true },
  { view: 'connect', icon: Network, label: 'Connect', alwaysEnabled: false },
];

export const HomePage = () => {
  const { activeView, setView, error, loadData } = useStore();
  const discoveredCount = useStore((s) => Object.keys(s.viewedReceiptIds).length);
  const receipts = useStore((s) => s.receipts);
  const setSelectedReceipt = useStore((s) => s.setSelectedReceipt);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-gray-900 selection:bg-red-200 selection:text-red-900 overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-gray-900 focus:text-white focus:px-4 focus:py-2 focus:rounded focus:outline-none">Skip to main content</a>
      <header className="max-w-6xl mx-auto pt-8 px-4 sm:px-8 mb-8 border-b-4 border-gray-900 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-1">Paper Trail</h1>
          <p className="font-mono text-gray-600 text-sm">A forensic analysis of digital life receipts.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { const r = receipts[Math.floor(Math.random() * receipts.length)]; if (r) setSelectedReceipt(r.id); }} className="px-3 py-2 bg-red-600 text-white font-mono text-[11px] uppercase tracking-widest hover:bg-red-700 min-h-[36px]" aria-label="Open a random receipt and its connections">Surprise me</button>
          <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-2 font-mono text-xs text-red-700" aria-live="polite" aria-label={`${discoveredCount} connections discovered`}><Fingerprint size={14} aria-hidden="true" /><span className="font-bold">{discoveredCount}</span> discovered</div>
          <nav aria-label="View navigation">
            <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-sm shadow-inner">
              {NAV_ITEMS.map((item) => {
                const isActive = activeView === item.view;
                const isDisabled = !item.alwaysEnabled && !isActive;
                return (
                  <button key={item.view} aria-current={isActive ? 'page' : undefined} onClick={() => !isDisabled && setView(item.view)} disabled={isDisabled} className={`flex items-center gap-1.5 px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors min-h-[36px] ${isActive ? 'bg-gray-900 text-white shadow-md' : isDisabled ? 'text-gray-500 cursor-not-allowed opacity-40' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-300'}`} title={isDisabled ? 'Click a receipt to view connections' : ''}>
                    <item.icon size={14} aria-hidden="true" /><span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </header>
      <MotionConfig reducedMotion="user">
        <main id="main-content" className="px-4 sm:px-8">
          {error ? (
            <div className="py-20 text-center text-red-600 font-mono" role="alert">Failed to load receipts: {error}</div>
          ) : (
            <Suspense fallback={<div className="py-20 text-center font-mono text-gray-600" role="status">Loading view…</div>}>
              <AnimatePresence mode="wait">
                {activeView === 'explore' && <Ledger key="ledger" />}
                {activeView === 'connect' && <TheWeb key="web" />}
                {activeView === 'story' && <TheThread key="story" />}
                {activeView === 'insights' && <InsightsDashboard key="insights" />}
              </AnimatePresence>
            </Suspense>
          )}
        </main>
      </MotionConfig>
      <footer className="max-w-6xl mx-auto px-4 sm:px-8 py-8 mt-12 border-t-2 border-dashed border-gray-300">
        <p className="font-mono text-xs text-gray-600 text-center">Paper Trail — React 19 · TypeScript · Tailwind CSS 4 · Zustand · Framer Motion · Built for WebRush</p>
      </footer>
    </div>
  );
};
