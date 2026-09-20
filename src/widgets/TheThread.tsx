import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../shared/store/useStore';
import { ReceiptCard } from '../shared/ui/ReceiptCard';
import { BookOpen } from 'lucide-react';

/**
 * Hand-crafted story chapters derived from forensic analysis of the dataset.
 * The dataset covers 2015-2018 with household transactions and Spotify history.
 */
const CHAPTERS = [
  {
    id: 'chapter-1',
    title: 'The Commute Routine',
    subtitle: 'Why does the same route appear 47 times?',
    description:
      'The data reveals a relentless cycle: train tickets, auto rides, the same stations. Morning snacks at the same stalls. This person was trapped in a daily grind — wake, commute, work, commute, sleep. The Spotify history confirms it: the same playlists on repeat during transit hours.',
    datePrefix: '2018-09',
    filterFn: (tags: string[]) => tags.includes('transportation') || tags.includes('food'),
  },
  {
    id: 'chapter-2',
    title: 'The Subscription Era',
    subtitle: 'When digital life took over',
    description:
      'Netflix, mobile data boosters, Tata Sky recharges, HBR subscriptions. The receipts show a person investing heavily in digital consumption. Combined with the Spotify data showing listening sessions stretching past midnight, a picture emerges: someone filling solitary evenings with screens.',
    datePrefix: '2018-09',
    filterFn: (tags: string[]) => tags.includes('subscription'),
  },
  {
    id: 'chapter-3',
    title: 'The Festival Break',
    subtitle: 'Something changed in September',
    description:
      'Ganesh Pujan purchases. Festival decorations. A sudden spike in spending that breaks the monotony of transit and subscriptions. For the first time in weeks, the receipts show something other than routine — they show celebration, community, and a pause from the daily grind.',
    datePrefix: '2018-09',
    filterFn: (tags: string[]) => tags.includes('festivals') || tags.includes('culture'),
  },
  {
    id: 'chapter-4',
    title: 'The Journey South',
    subtitle: 'Jan 2015: ropeways, temples, and tea',
    description:
      'Buried at the bottom of the dataset is a trip. Share jeeps, ropeways, temple prasad, monument tickets, tea at roadside stalls. This is not a commute — it is an escape. The receipts from this single day paint a vivid picture of someone exploring hills and holy places, far from the routine that would define their later years.',
    datePrefix: '2015-01',
    filterFn: (tags: string[]) =>
      tags.includes('transportation') || tags.includes('culture') || tags.includes('food'),
  },
];

export const TheThread = () => {
  const { receipts, setSelectedReceipt } = useStore();

  const chapterData = useMemo(() => {
    return CHAPTERS.map((chapter) => {
      const context = receipts
        .filter(
          (r) => r.timestamp.startsWith(chapter.datePrefix) && chapter.filterFn(r.tags)
        )
        .slice(0, 4);

      return { ...chapter, context };
    });
  }, [receipts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-20 pb-24"
    >
      <div className="text-center">
        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" aria-hidden="true" />
        <h2 className="text-3xl font-black uppercase tracking-tighter">The Narrative Thread</h2>
        <p className="font-mono text-gray-500 mt-2 max-w-xl mx-auto leading-relaxed">
          Four chapters extracted from receipt metadata. Each one answers a question the data
          raised — but only if you look closely enough.
        </p>
      </div>

      {chapterData.map((chapter, i) => (
        <motion.section
          key={chapter.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          aria-labelledby={`${chapter.id}-title`}
          className="relative"
        >
          {/* Chapter Number */}
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-3">
            Chapter {i + 1}
          </div>

          <div className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 md:p-8">
            <h3 id={`${chapter.id}-title`} className="text-2xl font-black uppercase mb-1">
              {chapter.title}
            </h3>
            <p className="font-mono text-red-600 text-sm italic mb-4">{chapter.subtitle}</p>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed max-w-2xl">
              {chapter.description}
            </p>

            {chapter.context.length > 0 && (
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 mb-3">
                  Supporting Evidence ({chapter.context.length} receipts)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {chapter.context.map((ctx) => (
                    <ReceiptCard
                      key={ctx.id}
                      receipt={ctx}
                      onClick={() => setSelectedReceipt(ctx.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      ))}
    </motion.div>
  );
};
