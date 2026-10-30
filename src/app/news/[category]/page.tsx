import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryNews, getLatestNews } from '@/lib/news-service';
import { formatTimeAgo, formatEditorialDate } from '@/lib/date-utils';
import { Clock, ArrowRight, ChevronRight } from 'lucide-react';

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category).replace('_', ' ');

  // Fetch articles belonging to this category
  const articles = await getCategoryNews(category, 24);
  const fallbackArticles = articles.length > 0 ? articles : await getLatestNews(12);

  return (
    <main className="mx-auto max-w-[1400px] px-4 md:px-6 py-8">
      {/* Category Header */}
      <div className="border-b border-[rgba(33,29,24,0.1)] dark:border-white/10 pb-4 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/" className="text-xs text-[#6F675C] dark:text-slate-400 hover:underline">Home</Link>
          <ChevronRight size={12} className="text-[#6F675C]/50" />
          <Link href="/news" className="text-xs text-[#6F675C] dark:text-slate-400 hover:underline">All News</Link>
          <ChevronRight size={12} className="text-[#6F675C]/50" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C3D5A] dark:text-sky-400">
            {decodedCategory}
          </span>
        </div>
        <h1 className="font-serif font-black text-3xl md:text-5xl text-[#211D18] dark:text-white capitalize mt-1">
          {decodedCategory} News
        </h1>
        <p className="text-sm text-[#6F675C] dark:text-slate-400 mt-1">
          Verified coverage, breaking dispatches, and reports across {decodedCategory}.
        </p>
      </div>

      {/* Grid of articles */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {fallbackArticles.map((story) => (
          <article
            key={story.id}
            className="bg-[#FFFDF7] dark:bg-[#141414] rounded-xl border border-[rgba(33,29,24,0.1)] dark:border-white/10 overflow-hidden shadow-sm hover:border-[#1C3D5A]/40 dark:hover:border-sky-500/40 transition flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[16/10] bg-slate-200 dark:bg-neutral-900 overflow-hidden relative">
                <img
                  src={story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600'}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-[10px] text-[#6F675C] dark:text-slate-400 mb-1.5 font-medium">
                  <span className="font-bold uppercase tracking-wider text-[#1C3D5A] dark:text-sky-400">
                    {story.region || story.category || 'News'}
                  </span>
                  <span>{formatTimeAgo(story.publishedAt)}</span>
                </div>
                <Link href={`/article/${story.id}`}>
                  <h2 className="font-serif font-bold text-base text-[#211D18] dark:text-slate-100 group-hover:text-[#1C3D5A] dark:group-hover:text-sky-400 transition line-clamp-2 leading-snug">
                    {story.title}
                  </h2>
                </Link>
                <p className="text-xs text-[#6F675C] dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                  {story.summary}
                </p>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-[rgba(33,29,24,0.06)] dark:border-white/10 flex items-center justify-between text-[11px] text-[#6F675C] dark:text-slate-400">
              <span className="font-medium">
                {formatEditorialDate(story.publishedAt)}
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
    </main>
  );
}
