import { getLatestShorts } from '@/lib/news-service';
import { ShortVideo } from '@/types';
import { Play, VideoOff } from 'lucide-react';
import ShortsClientGrid from '@/components/ShortsClientGrid';

export default async function ShortsPage() {
  const shorts = await getLatestShorts(20);

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(33,29,24,0.1)] dark:border-white/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 dark:text-red-400">
            Vertical Video Feed
          </span>
          <h1 className="font-serif font-black text-3xl md:text-4xl text-[#211D18] dark:text-white flex items-center gap-2 mt-1">
            <Play size={24} className="fill-current text-red-600 dark:text-red-400" /> DK Shorts
          </h1>
          <p className="text-xs text-[#6F675C] dark:text-slate-400 mt-1">
            Tap any video below to watch in full-screen vertical player.
          </p>
        </div>
      </div>

      {shorts.length > 0 ? (
        <ShortsClientGrid shorts={shorts} />
      ) : (
        <div className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 p-12 text-center text-[#6F675C] dark:text-slate-400 max-w-lg mx-auto">
          <VideoOff size={40} className="mx-auto mb-3 opacity-40 text-red-500" />
          <h3 className="font-serif font-bold text-lg text-[#211D18] dark:text-white">No Shorts Available</h3>
          <p className="text-xs mt-1">There are currently no vertical video bulletins uploaded in the newsroom.</p>
        </div>
      )}
    </main>
  );
}
