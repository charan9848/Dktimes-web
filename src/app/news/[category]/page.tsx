import Link from 'next/link';
import { getCategoryNews, getLatestNews } from '@/lib/news-service';
import { formatEditorialDate } from '@/lib/date-utils';
import TimeAgo from '@/components/TimeAgo';
import { Clock, ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const resolvedSearchParams = await searchParams;
  const pageNum = parseInt(resolvedSearchParams.page || '1', 10) || 1;
  const pageSize = 24;

  const decodedCategory = decodeURIComponent(category).replace('_', ' ');

  // Fetch articles belonging to this category
  const { articles, totalCategoryCount } = await getCategoryNews(
    category,
    pageSize,
    pageNum
  );

  const fallbackArticles = articles.length > 0 ? articles : await getLatestNews(12);
  const totalCount = totalCategoryCount || fallbackArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      {/* Category Header */}
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-4 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="text-xs text-[#6F675C] dark:text-slate-400 hover:underline">
            Home
          </Link>
          <ChevronRight size={12} className="text-[#6F675C]/50" />
          <Link href="/news" className="text-xs text-[#6F675C] dark:text-slate-400 hover:underline">
            All News
          </Link>
          <ChevronRight size={12} className="text-[#6F675C]/50" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
            {decodedCategory}
          </span>
        </div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 mt-1">
          <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white capitalize">
            {decodedCategory} News
          </h1>
          <span className="text-xs font-bold text-[#6F675C] dark:text-slate-400 bg-[#F5F1E8] dark:bg-white/10 px-3 py-1 rounded-full border border-[rgba(33,29,24,0.1)] dark:border-white/10">
            {totalCount} Stories Available • Page {pageNum} of {totalPages}
          </span>
        </div>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-1.5">
          Verified coverage, breaking dispatches, and reports across {decodedCategory}.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fallbackArticles.map((story) => (
          <article
            key={story.id}
            className="bg-[#FFFDF7] dark:bg-[#141414] rounded-2xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[16/10] bg-neutral-900 overflow-hidden relative">
                <img
                  src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#1C3D5A]/90 dark:bg-sky-700/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
                  {story.region || story.category || 'News'}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-[#6F675C] dark:text-slate-400 mb-2 font-medium">
                  <span className="flex items-center gap-1 font-semibold text-[#1C3D5A] dark:text-sky-400">
                    <Clock size={11} />
                    <TimeAgo timestamp={story.publishedAt} />
                  </span>
                  <span>•</span>
                  <span>{formatEditorialDate(story.publishedAt)}</span>
                </div>
                <Link href={`/article/${story.id}`}>
                  <h2 className="font-serif font-bold text-base md:text-lg text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                    {story.title}
                  </h2>
                </Link>
                <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-2 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-xs mt-2">
              <span className="text-[10px] text-[#6F675C] dark:text-slate-400 font-medium">
                {story.author || 'DK Times Editorial'}
              </span>
              <Link
                href={`/article/${story.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1C3D5A] dark:text-sky-400 hover:underline"
              >
                Read More <ArrowRight size={12} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 pt-8 border-t border-[rgba(33,29,24,0.1)] dark:border-white/10 flex items-center justify-between">
          <p className="text-xs font-semibold text-[#6F675C] dark:text-slate-400">
            Page {pageNum} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            {pageNum > 1 && (
              <Link
                href={`/news/${category}?page=${pageNum - 1}`}
                className="px-3 py-1.5 rounded-xl border border-[rgba(33,29,24,0.15)] dark:border-white/15 text-xs font-bold flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </Link>
            )}
            {pageNum < totalPages && (
              <Link
                href={`/news/${category}?page=${pageNum + 1}`}
                className="px-3 py-1.5 rounded-xl border border-[rgba(33,29,24,0.15)] dark:border-white/15 text-xs font-bold flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
