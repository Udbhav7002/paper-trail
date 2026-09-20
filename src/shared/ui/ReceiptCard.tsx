import { memo } from 'react';
import { ShoppingCart, Music, MessageSquare, Search, StickyNote, MapPin, Calendar } from 'lucide-react';
import type { Receipt } from '../../entities/receipt';
import { format } from 'date-fns';

interface Props {
  receipt: Receipt;
  onClick?: (id: string) => void;
}

const ICONS: Record<string, typeof StickyNote> = {
  purchase: ShoppingCart,
  music: Music,
  message: MessageSquare,
  search: Search,
  note: StickyNote,
};

const TYPE_COLORS: Record<string, string> = {
  purchase: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100',
  music: 'bg-violet-50 text-violet-700 group-hover:bg-violet-100',
  message: 'bg-blue-50 text-blue-700 group-hover:bg-blue-100',
  search: 'bg-amber-50 text-amber-700 group-hover:bg-amber-100',
  note: 'bg-rose-50 text-rose-700 group-hover:bg-rose-100',
};

const cardBody = (receipt: Receipt, colorClass: string) => {
  const Icon = ICONS[receipt.type] || StickyNote;
  return (
    <>
      <header className="flex justify-between items-start mb-3 mt-1">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full transition-colors ${colorClass}`}>
            <Icon size={16} aria-hidden="true" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
            {receipt.type}
          </span>
        </div>
      </header>

      <h3 className="text-base font-bold leading-snug mb-1.5 line-clamp-2">
        {receipt.title}
      </h3>

      <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">
        {receipt.description}
      </p>

      <footer className="pt-3 border-t border-dashed border-gray-300 flex flex-col gap-1.5 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar size={12} aria-hidden="true" />
          <time dateTime={receipt.timestamp}>
            {format(new Date(receipt.timestamp), "MMM d, yyyy · h:mm a")}
          </time>
        </div>
        {receipt.location && receipt.location !== 'Unknown' && (
          <div className="flex items-center gap-1.5">
            <MapPin size={12} aria-hidden="true" />
            <span className="truncate">{receipt.location}</span>
          </div>
        )}
      </footer>
    </>
  );
};

/**
 * ReceiptCard renders either a <button> (when onClick is provided) or a plain
 * <article> (display-only). This keeps jsx-a11y happy — no non-interactive
 * element gets mouse/keyboard handlers.
 */
export const ReceiptCard = memo(function ReceiptCard({ receipt, onClick }: Props) {
  const colorClass = TYPE_COLORS[receipt.type] || 'bg-gray-100 text-gray-700';
  const baseClass =
    'w-full text-left bg-[#fdfbf7] border-2 border-dashed border-gray-300 p-5 font-mono text-gray-900 rounded-sm relative overflow-hidden';

  if (onClick) {
    return (
      <button
        type="button"
        onClick={() => onClick(receipt.id)}
        className={`${baseClass} cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2`}
        aria-label={`View connections for ${receipt.type}: ${receipt.title}`}
      >
        {cardBody(receipt, colorClass)}
      </button>
    );
  }

  return (
    <article className={baseClass}>
      {cardBody(receipt, colorClass)}
    </article>
  );
});
