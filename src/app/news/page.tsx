import { Metadata } from 'next';
import Link from 'next/link';
import { getLatestNews } from '@/lib/news-service';
import { formatTimeAgo, formatEditorialDate } from '@/lib/date-utils';
import { Newspaper, Clock, ArrowRight, Filter } from 'lucide-react';

export const metadata: Metadata = {
  title: 'All News — DK Times Complete Edition',
  description: 'Complete stream of real-time verified news across Telangana, Andhra Pradesh, Politics, Tech, and more.',
};

export default async function AllNewsPage() {
  const articles = await getLatestNews(40);

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      {/* Header */}
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-5 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
            Broadsheet Archive
          </span>
          <span className="text-xs text-[#6F675C] dark:text-slate-400">•</span>
          <span className="text-[11px] font-semibold text-[#6F675C] dark:text-slate-400">
            {articles.length} Stories Published
          </span>
        </div>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white flex items-center gap-3">
          <Newspaper size={36} className="text-[#1C3D5A] dark:text-sky-400" /> All News & Continuous Feed
        </h1>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-2">
          Chronological verified news stream from Telangana, Andhra Pradesh, National Politics, and Global Affairs.
        </p>
      </div>

      {/* Category quick jump pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <span className="text-xs font-bold text-[#6F675C] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter size={12} /> Filter:
        </span>
        {[
          { label: 'All Stories', href: '/news', active: true },
          { label: 'Telangana', href: '/news/telangana' },
          { label: 'Andhra Pradesh', href: '/news/andhra_pradesh' },
          { label: 'Politics', href: '/news/politics' },
          { label: 'Technology', href: '/news/technology' },
          { label: 'Entertainment', href: '/news/entertainment' },
          { label: 'Sports', href: '/news/sports' },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
              c.active
                ? 'bg-[#1C3D5A] dark:bg-sky-600 text-white shadow-sm'
                : 'bg-[#FFFDF7] dark:bg-[#141414] text-[#6F675C] dark:text-slate-300 hover:text-[#211D18] dark:hover:text-white border border-[rgba(33,29,24,0.1)] dark:border-white/10'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* All Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((story) => (
          <article
            key={story.id}
            className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
          >
            <div>
              {/* Image Frame */}
              <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                {story.imageUrl && (
                  <img
                    src={story.imageUrl}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                )}
                <div className="absolute top-3 left-3 bg-[#1C3D5A]/90 dark:bg-sky-700/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                  {story.region || story.category || 'News'}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Properly formatted date & relative time */}
                <div className="flex items-center gap-2 text-[11px] text-[#6F675C] dark:text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-[#1C3D5A] dark:text-sky-400">
                    <Clock size={11} /> {formatTimeAgo(story.publishedAt)}
                  </span>
                  <span>•</span>
                  <span>{formatEditorialDate(story.publishedAt)}</span>
                </div>

                <Link href={`/article/${story.id}`}>
                  <h2 className="font-serif font-bold text-base md:text-lg text-[#211D18] dark:text-white group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition leading-snug line-clamp-2">
                    {story.title}
                  </h2>
                </Link>

                <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2.5 line-clamp-3 leading-relaxed">
                  {story.summary}
                </p>
              </div>
            </div>

            {/* Card Footer with Read More button & date */}
            <div className="px-5 py-3.5 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-[#6F675C] dark:text-slate-400 font-medium">
                {formatEditorialDate(story.publishedAt)}
              </span>

              {/* Explicit Read More Action */}
              <Link
                href={`/article/${story.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1C3D5A] dark:text-sky-400 group-hover:underline"
              >
                Read More <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
