import { useStore } from '../../shared/store/useStore';
import { Music, ShoppingCart, Calendar, Moon, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export const InsightsDashboard = () => {
  const insights = useStore((s) => s.insights);

  if (!insights) return null;

  const cards = [
    {
      icon: BarChart3,
      label: 'Total Receipts',
      value: insights.totalReceipts.toLocaleString(),
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: Music,
      label: 'Top Artist',
      value: insights.topArtist?.name ?? '—',
      sub: insights.topArtist ? `${insights.topArtist.count} plays` : '',
      color: 'bg-violet-50 text-violet-600',
    },
    {
      icon: ShoppingCart,
      label: 'Top Spending Category',
      value: insights.topCategory?.name ?? '—',
      sub: insights.topCategory ? `${insights.topCategory.count} transactions` : '',
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: TrendingUp,
      label: 'Total Spent',
      value: `₹${insights.totalSpent.toLocaleString()}`,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Calendar,
      label: 'Most Active Day',
      value: insights.mostActiveDay ? format(new Date(insights.mostActiveDay.date), 'MMM d, yyyy') : '—',
      sub: insights.mostActiveDay ? `${insights.mostActiveDay.count} activities` : '',
      color: 'bg-rose-50 text-rose-600',
    },
    {
      icon: Moon,
      label: 'Late Night Activities',
      value: insights.lateNightCount.toLocaleString(),
      sub: 'Between 12 AM – 6 AM',
      color: 'bg-indigo-50 text-indigo-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-6xl mx-auto pb-24"
    >
      <div className="text-center mb-12">
        <Sparkles size={48} className="mx-auto mb-4 text-amber-400" aria-hidden="true" />
        <h2 className="text-3xl font-black uppercase tracking-tighter">
          Data Insights
        </h2>
        <p className="font-mono text-gray-600 mt-2">
          Patterns discovered across {insights.totalReceipts.toLocaleString()} receipts
        </p>
        {insights.dateRange.start && (
          <p className="font-mono text-xs text-gray-600 mt-1">
            {format(new Date(insights.dateRange.start), 'MMM yyyy')} — {format(new Date(insights.dateRange.end), 'MMM yyyy')}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon size={20} aria-hidden="true" />
              </div>
            </div>
            <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-black truncate">{card.value}</p>
            {card.sub && <p className="font-mono text-xs text-gray-500 mt-1">{card.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Type Distribution */}
      <div className="bg-white border-2 border-gray-900 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] p-6">
        <h3 className="font-mono text-sm uppercase tracking-widest text-gray-500 mb-6">Receipt Type Distribution</h3>
        <div className="space-y-4">
          {Object.entries(insights.receiptsByType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => {
              const pct = Math.round((count / insights.totalReceipts) * 100);
              return (
                <div key={type} className="flex items-center gap-4">
                  <span className="font-mono text-xs uppercase w-20 text-gray-500 shrink-0">{type}</span>
                  <div className="flex-1 bg-gray-100 h-6 relative overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute inset-y-0 left-0 bg-gray-900"
                    />
                  </div>
                  <span className="font-mono text-xs text-gray-500 w-16 text-right shrink-0">{count} ({pct}%)</span>
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
};
