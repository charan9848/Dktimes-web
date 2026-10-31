import { Metadata } from 'next';
import Link from 'next/link';
import { getPaginatedNews } from '@/lib/news-service';
import { formatEditorialDate } from '@/lib/date-utils';
import TimeAgo from '@/components/TimeAgo';
import { Newspaper, Clock, ArrowRight, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All News Archive — DK Times Complete Edition',
  description:
    'Complete archive of real-time verified news across Telangana, Andhra Pradesh, Politics, Tech, and more.',
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AllNewsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const pageNum = parseInt(resolvedParams.page || '1', 10) || 1;
  const pageSize = 24;

  const { articles, totalCount, totalPages, currentPage } = await getPaginatedNews(
    pageNum,
    pageSize
  );

  // Helper to build page links
  const getPageUrl = (p: number) => `/news?page=${p}`;

  // Generate page numbers to display (current page +/- 2)
  const pagePills: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pagePills.push(i);
  } else {
    pagePills.push(1);
    if (currentPage > 3) pagePills.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pagePills.push(i);
    if (currentPage < totalPages - 2) pagePills.push('...');
    pagePills.push(totalPages);
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      {/* Editorial Archive Header */}
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-5 mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
            Broadsheet News Archive
          </span>
          <span className="text-xs text-[#6F675C] dark:text-slate-400">•</span>
          <span className="text-[11px] font-bold text-[#6F675C] dark:text-slate-300">
            {totalCount} Total Stories Published
          </span>
          <span className="text-xs text-[#6F675C] dark:text-slate-400">•</span>
          <span className="text-[11px] font-semibold text-[#1C3D5A] dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2.5 py-0.5 rounded-full border border-sky-200 dark:border-sky-800">
            Page {currentPage} of {totalPages}
          </span>
        </div>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white flex items-center gap-3">
          <Newspaper size={36} className="text-[#1C3D5A] dark:text-sky-400 shrink-0" />
          All News &amp; Continuous Feed
        </h1>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-2">
          Real-time chronological dispatches from Telangana, Andhra Pradesh, National Politics, and Global Affairs.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        <span className="text-xs font-bold text-[#6F675C] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
          <Filter size={12} /> Filter:
        </span>
        {[
          { label: 'All Stories (500+)', href: '/news', active: true },
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

      {/* All Articles Grid (24 per page) */}
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

              {/* Card Body */}
              <div className="p-5">
                {/* Live Dynamic Relative Time & Date */}
                <div className="flex items-center gap-2 text-[11px] text-[#6F675C] dark:text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-[#1C3D5A] dark:text-sky-400">
                    <Clock size={11} />
                    <TimeAgo timestamp={story.publishedAt} />
                  </span>
                  <span>•</span>
                  <span>{formatEditorialDate(story.publishedAt)}</span>
                </div>

                <Link href={`/article/${story.id}`}>
                  <h2 className="font-serif font-bold text-base md:text-lg text-[#211D18] dark:text-white group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition leading-snug line-clamp-2">
                    {story.title}
                  </h2>
                </Link>

                <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {story.summary}
                </p>
              </div>
            </div>

            {/* Read More Footer */}
            <div className="px-5 pb-5 pt-2 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs mt-2">
              <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                {story.author || 'DK Times Editorial'}
              </span>
              <Link
                href={`/article/${story.id}`}
                className="font-bold text-xs text-[#1C3D5A] dark:text-sky-400 hover:underline flex items-center gap-1 group/btn"
              >
                Read More{' '}
                <ArrowRight
                  size={12}
                  className="group-hover/btn:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* ================= PAGINATION CONTROLS ================= */}
      {totalPages > 1 && (
        <div className="mt-12 pt-8 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-semibold text-[#6F675C] dark:text-slate-400">
            Showing <span className="font-bold text-[#211D18] dark:text-white">{(currentPage - 1) * pageSize + 1}</span> -{' '}
            <span className="font-bold text-[#211D18] dark:text-white">{Math.min(currentPage * pageSize, totalCount)}</span> of{' '}
            <span className="font-bold text-[#211D18] dark:text-white">{totalCount}</span> stories
          </p>

          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Previous Button */}
            {currentPage > 1 ? (
              <Link
                href={getPageUrl(currentPage - 1)}
                className="px-3 py-2 rounded-xl border border-[rgba(33,29,24,0.15)] dark:border-white/15 bg-[#FFFDF7] dark:bg-[#141414] hover:bg-[#1C3D5A] hover:text-white text-xs font-bold text-[#211D18] dark:text-slate-200 transition flex items-center gap-1 shadow-xs"
              >
                <ChevronLeft size={14} /> Previous
              </Link>
            ) : (
              <span className="px-3 py-2 rounded-xl border border-[rgba(33,29,24,0.06)] dark:border-white/5 text-neutral-400 dark:text-neutral-600 text-xs font-bold cursor-not-allowed flex items-center gap-1">
                <ChevronLeft size={14} /> Previous
              </span>
            )}

            {/* Page Number Pills */}
            {pagePills.map((pill, idx) =>
              pill === '...' ? (
                <span key={`dots-${idx}`} className="px-2 py-1 text-xs text-[#6F675C]">
                  ...
                </span>
              ) : (
                <Link
                  key={`p-${pill}`}
                  href={getPageUrl(pill as number)}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold transition shadow-xs ${
                    currentPage === pill
                      ? 'bg-[#1C3D5A] text-white dark:bg-sky-600'
                      : 'bg-[#FFFDF7] dark:bg-[#141414] border border-[rgba(33,29,24,0.15)] dark:border-white/15 text-[#211D18] dark:text-slate-200 hover:border-[#1C3D5A]'
                  }`}
                >
                  {pill}
                </Link>
              )
            )}

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link
                href={getPageUrl(currentPage + 1)}
                className="px-3 py-2 rounded-xl border border-[rgba(33,29,24,0.15)] dark:border-white/15 bg-[#FFFDF7] dark:bg-[#141414] hover:bg-[#1C3D5A] hover:text-white text-xs font-bold text-[#211D18] dark:text-slate-200 transition flex items-center gap-1 shadow-xs"
              >
                Next <ChevronRight size={14} />
              </Link>
            ) : (
              <span className="px-3 py-2 rounded-xl border border-[rgba(33,29,24,0.06)] dark:border-white/5 text-neutral-400 dark:text-neutral-600 text-xs font-bold cursor-not-allowed flex items-center gap-1">
                Next <ChevronRight size={14} />
              </span>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
